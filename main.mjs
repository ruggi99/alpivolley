import nextEnv from "@next/env";

import { algoritmo } from "./lib/algoritmo.js";
import { BaseRow, transformData } from "./lib/baserow.js";
import { FASI, FASI2 } from "./lib/const.js";
const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const ALPHABET = "abcdefg";

const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];

const NUMERO_FASI = 4;

const baserow = new BaseRow(BASEROW_TOKEN);

function whoIsWinner(row) {
  const punti1 = row["Punti 1"];
  const punti2 = row["Punti 2"];
  const diff = Math.abs(punti1 - punti2);
  if (punti1 == 23 || (punti1 > 20 && diff > 1)) {
    return 1;
  }
  if (punti2 == 23 || (punti2 > 20 && diff > 1)) {
    return 2;
  }
  return 0;
}

function calculateSchema() {
  const data = {};
  for (let fase = 1; fase <= NUMERO_FASI; fase++) {
    for (let i = 0; i < 2 ** (fase - 1); i++) {
      const obj = {
        fase: FASI[fase],
        fase2: "Diretta",
        ordine: i + 1,
      };
      obj.winner = {
        fase: FASI[fase - 1],
        fase2: "Diretta",
        ordine: parseInt(i / 2) + 1,
        squadra: (i % 2) + 1,
      };
      if (fase == NUMERO_FASI) {
        obj.looser = {
          fase: FASI[fase - 1],
          fase2: "Ripescaggio 1",
          ordine: parseInt(i / 2) + 1,
          squadra: 2 - (i % 2),
        };
      } else {
        obj.looser = {
          fase: FASI[fase],
          fase2: "Ripescaggio 2",
          ordine: i + 1,
          squadra: 1,
        };
      }
      data[`${obj.fase},${obj.fase2},${obj.ordine}`] = obj;
    }
    if (fase < NUMERO_FASI) {
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const obj = {
          fase: FASI[fase],
          fase2: "Ripescaggio 1",
          ordine: i + 1,
        };
        if (fase > 0) {
          obj.winner = {
            fase: FASI[fase],
            fase2: "Ripescaggio 2",
            ordine: i + 1,
            squadra: 2,
          };
          obj.looser = {
            fase: FASI[fase],
            fase2: "Ripescaggio 2",
            ordine: i + 1,
            referee: true,
          };
        }
        data[`${obj.fase},${obj.fase2},${obj.ordine}`] = obj;
      }
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const obj = {
          fase: FASI[fase],
          fase2: "Ripescaggio 2",
          ordine: i + 1,
        };
        if (fase > 0) {
          obj.winner = {
            fase: FASI[fase - 1],
            fase2: fase == 1 ? "Diretta" : "Ripescaggio 1",
            ordine: parseInt(i / 2) + 1,
            squadra: 2 - (i % 2),
          };
          obj.looser = {
            fase: FASI[fase - 1],
            fase2: fase == 1 ? "Diretta" : "Ripescaggio 1",
            ordine: parseInt(i / 2) + 1,
            referee: true,
          };
        }
        data[`${obj.fase},${obj.fase2},${obj.ordine}`] = obj;
      }
    }
  }
  return data;
}

async function calculateWinAndLoss(categoria) {
  const res = await baserow.list_rows(categoria, "Eliminazione");
  const data = transformData((await res.json())["results"]);

  const data_grouped = Object.groupBy(data, (v) => [
    v.Fase.substr(1),
    v["Fase 2"],
    v["Ordine"],
  ]);

  const schema = calculateSchema();
  const new_data = {};

  // const keys = Object.keys(data_grouped).filter((v) => v.startsWith("Ottavi"));
  const keys = Object.keys(data_grouped);

  for (const key of keys) {
    const row = data_grouped[key][0];
    const whoWinner = whoIsWinner(row);
    if (whoWinner == 0) {
      continue;
    }
    for (const type of ["winner", "looser"]) {
      const obj = schema[key][type];
      const key2 = `${obj.fase},${obj.fase2},${obj.ordine}`;
      if (!(key2 in new_data)) {
        new_data[key2] = {};
      }
      if (type == "winner") {
        new_data[key2]["squadra" + obj.squadra] = row["Squadra " + whoWinner];
      } else if (obj.referee) {
        new_data[key2]["arbitro"] = row["Squadra " + (3 - whoWinner)];
      } else {
        new_data[key2]["squadra" + obj.squadra] =
          row["Squadra " + (3 - whoWinner)];
      }
    }
  }
  console.log(new_data);
  // writeFileSync("./test.json", JSON.stringify(schema, null, 2));
  await applyDifferences(categoria, "Eliminazione", data_grouped, new_data);
}

async function applyDifferences(categoria, fase, data_grouped, new_data) {
  for (const key in new_data) {
    const data = new_data[key];
    const old_data = data_grouped[key][0];
    if (
      (data.squadra1 && data.squadra1 != old_data["Squadra 1"]) ||
      (data.squadra2 && data.squadra2 != old_data["Squadra 2"]) ||
      (data.arbitro && data.arbitro != old_data["Arbitro"])
    ) {
      await baserow.modify_row(categoria, fase, old_data["id"], {
        "Squadra 1": data.squadra1,
        "Squadra 2": data.squadra2,
        Arbitro: data.arbitro,
      });
    }
  }
}

async function loadInitialData(categoria) {
  let res = await baserow.list_rows(categoria, "Eliminazione");
  const data = (await res.json())["results"];
  res = await baserow.list_rows(categoria, "Squadre");
  const squadre = (await res.json())["results"];

  const data_grouped = Object.groupBy(data, (v) => [
    v.Fase["value"].substr(1),
    v["Fase 2"]["value"],
  ]);

  const nodi = [];
  for (let fase = 0; fase <= NUMERO_FASI; fase++) {
    for (const fase2 of FASI2) {
      if (fase2 == FASI2[0]) {
        const _nodi = algoritmo(Math.max(fase, 1));
        for (let i = 0; i < _nodi.length / 2; i++) {
          nodi.push({
            squadra1: _nodi[i * 2],
            squadra2: _nodi[i * 2 + 1],
            fase,
            fase2,
            ordine: i,
          });
        }
      } else if (fase2 == FASI2[1] && fase > 0 && fase < NUMERO_FASI) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 3],
            squadra2: _nodi[i * 4 + 1],
            fase,
            fase2,
            ordine: i,
          });
        }
      } else if (fase2 == FASI2[2] && fase > 0 && fase < NUMERO_FASI) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 2],
            squadra2: _nodi[i * 4 + 3],
            fase,
            fase2,
            ordine: i,
          });
        }
      }
    }
  }
  // console.log(data_grouped);
  for (const nodo of nodi) {
    const fase_str = FASI[nodo.fase];
    const rows = data_grouped[`${fase_str},${nodo.fase2}`]?.filter(
      (v) => v["Ordine"] == nodo.ordine + 1,
    );
    if (rows == undefined || rows.length == 0) {
      // Create the row if no match
      await baserow.create_row(categoria, "Eliminazione", {
        "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
        "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
        Fase: `${ALPHABET[nodo.fase]}${fase_str}`,
        "Fase 2": nodo.fase2,
        Ordine: nodo.ordine + 1,
      });
      continue;
    }
    // Check if the first row is aligned
    if (
      rows[0]["Squadra 1"][0]["value"] != squadre[nodo.squadra1 - 1]["Nome"] ||
      rows[0]["Squadra 2"][0]["value"] != squadre[nodo.squadra2 - 1]["Nome"]
    ) {
      await baserow.modify_row(categoria, "Eliminazione", rows[0]["id"], {
        "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
        "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
      });
    }
  }
}

async function deleteData(categoria) {
  const res = await baserow.list_rows(categoria, "Eliminazione");
  const data = (await res.json())["results"];

  const data_grouped = Object.groupBy(data, (v) => [
    v.Fase["value"].substr(1),
    v["Fase 2"]["value"],
  ]);

  const nodi = [];
  for (let fase = 0; fase <= NUMERO_FASI; fase++) {
    for (const fase2 of FASI2) {
      if (fase2 == FASI2[0]) {
        const _nodi = algoritmo(Math.max(fase, 1));
        for (let i = 0; i < _nodi.length / 2; i++) {
          nodi.push({
            squadra1: _nodi[i * 2],
            squadra2: _nodi[i * 2 + 1],
            fase,
            fase2,
            ordine: i,
          });
        }
      } else if (fase2 == FASI2[1] && fase > 0 && fase < NUMERO_FASI) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 3],
            squadra2: _nodi[i * 4 + 1],
            fase,
            fase2,
            ordine: i,
          });
        }
      } else if (fase2 == FASI2[2] && fase > 0 && fase < NUMERO_FASI) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 2],
            squadra2: _nodi[i * 4 + 3],
            fase,
            fase2,
            ordine: i,
          });
        }
      }
    }
  }
  // console.log(data_grouped);
  const data_to_delete = data.slice();
  for (const nodo of nodi) {
    const fase_str = FASI[nodo.fase];
    const rows = data_grouped[`${fase_str},${nodo.fase2}`]?.filter(
      (v) => v["Ordine"] == nodo.ordine + 1,
    );
    if (rows == undefined || rows.length == 0) {
      continue;
    }
    delete data_to_delete[data_to_delete.indexOf(rows[0])];
  }
  // console.log(data_to_delete);
  for (const data_to_d of data_to_delete) {
    if (!data_to_d) continue;
    // console.log(data_to_d);
    await baserow.delete_row(categoria, "Eliminazione", data_to_d["id"]);
  }
}

await calculateWinAndLoss("U13M");

// const schema = await calculateSchema();

// writeFileSync("./test.json", JSON.stringify(schema, null, 2));

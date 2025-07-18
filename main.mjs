import nextEnv from "@next/env";

import { writeFileSync } from "node:fs";

import { algoritmo } from "./lib/algoritmo.js";
import { BaseRow, transformData } from "./lib/baserow.js";
import { FASI, FASI2 } from "./lib/const.js";
const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];

const NUMERO_FASI = 5;

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

function calculateFakeAvulsa() {
  return Array(22) // E' 64
    .fill(0)
    .map((_, i) => "Squadra " + (i + 1).toString().padStart(2, "0"));
}

function calculateSchema(numero_fasi) {
  const data = {};
  for (let fase = 1; fase <= numero_fasi; fase++) {
    let algoritmoRet = algoritmo(fase);
    for (let i = 0; i < 2 ** (fase - 1); i++) {
      const obj = {
        fase: FASI[fase],
        fase2: "Diretta",
        ordine: i + 1,
        squadra1: algoritmoRet[i * 2],
        squadra2: algoritmoRet[i * 2 + 1],
      };
      obj.winner = {
        fase: FASI[fase - 1],
        fase2: "Diretta",
        ordine: parseInt(i / 2) + 1,
        squadra: (i % 2) + 1,
      };
      // Se è la prima fase si va direttamente al Ripescaggio 1
      if (fase == numero_fasi) {
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
    if (fase < numero_fasi) {
      let algoritmoRet = algoritmo(fase + 1);
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const obj = {
          fase: FASI[fase],
          fase2: "Ripescaggio 1",
          ordine: i + 1,
          squadra1: algoritmoRet[i * 4 + 3],
          squadra2: algoritmoRet[i * 4 + 1],
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
          squadra1: algoritmoRet[i * 4 + 2],
          squadra2: algoritmoRet[i * 4 + 3],
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

function calculateInitialSchema() {
  // Gold c'è sempre, Silver solo se > 32
  const fakeAvulsa = calculateFakeAvulsa();
  const FASE_PARTENZA = Math.min(Math.ceil(Math.log2(fakeAvulsa.length)), 5); // 5 = Sedicesimi
  console.log(FASE_PARTENZA);
  const data = calculateSchema(FASE_PARTENZA);
  writeFileSync(`./out/testInitialSchema.json`, JSON.stringify(data, null, 2));
  // Aggiungo la Finalissima
  data[`${FASI[0]},Diretta,1`] = {
    fase: FASI[0],
    fase2: "Diretta",
    ordine: 1,
  };
  // const algoritmoRet = algoritmo(FASE_PARTENZA);
  // console.log(algoritmoRet);
  // for (let i = 0; i < algoritmoRet.length; i += 2) {
  //   const firstSqPos = algoritmoRet[i];
  //   const secondSqPos = algoritmoRet[i + 1];
  //   data[`${FASI[FASE_PARTENZA]},Diretta,${i / 2 + 1}`]["squadra1"] =
  //     firstSqPos;
  //   data[`${FASI[FASE_PARTENZA]},Diretta,${i / 2 + 1}`]["squadra2"] =
  //     secondSqPos;
  // }

  for (let fase = FASE_PARTENZA; fase >= 0; fase--) {
    for (const fase2 of FASI2) {
      // La prima e l'ultima fase non hanno ripescaggio
      if ((fase == FASE_PARTENZA || fase == 0) && fase2 != "Diretta") {
        continue;
      }
      if (fase == 0) {
        continue;
      }
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const thisData = data[`${FASI[fase]},${fase2},${i + 1}`];
        const firstSqPos = thisData.squadra1;
        const secondSqPos = thisData.squadra2;

        const isFirstUndefined = firstSqPos === undefined;
        const isFirstValid = firstSqPos <= fakeAvulsa.length;
        const isFirstInvalid = !isFirstUndefined && !isFirstValid;
        const isSecondUndefined = secondSqPos === undefined;
        const isSecondValid = secondSqPos <= fakeAvulsa.length;
        const isSecondInvalid = !isSecondUndefined && !isSecondValid;

        const atLeastOneUndefined = isFirstUndefined || isSecondUndefined;
        const areAllDefined = !isFirstUndefined && !isSecondUndefined;
        const atLeastOneInvalid = isFirstInvalid || isSecondInvalid;
        const areAllValid = isFirstValid && isSecondValid;

        if (isFirstUndefined) {
          // La squadra esiste o non è ancora definita -> propago l'undefined
          const winner = thisData.winner;
          data[`${winner.fase},${winner.fase2},${winner.ordine}`][
            "squadra" + winner.squadra
          ] = undefined;
        }
        if (isSecondUndefined) {
          // La squadra esiste o non è ancora definita -> propago l'undefined
          const looser = thisData.looser;
          if (looser.referee === undefined) {
            data[`${looser.fase},${looser.fase2},${looser.ordine}`][
              "squadra" + looser.squadra
            ] = undefined;
          }
        }

        if (atLeastOneInvalid) {
          // Annullo la partita
          data[`${FASI[fase]},${fase2},${i + 1}`] = null;
        } else {
          if (isFirstValid) {
            // La squadra esiste o non è ancora definita -> propago l'undefined
            const winner = thisData.winner;
            data[`${winner.fase},${winner.fase2},${winner.ordine}`][
              "squadra" + winner.squadra
            ] = undefined;
          }
          if (isSecondValid) {
            // La squadra esiste o non è ancora definita -> propago l'undefined
            const looser = thisData.looser;
            if (looser.referee === undefined) {
              data[`${looser.fase},${looser.fase2},${looser.ordine}`][
                "squadra" + looser.squadra
              ] = undefined;
            }
          }
        }
      }
    }
    writeFileSync(`./out/test${fase}.json`, JSON.stringify(data, null, 2));
  }
  return data;
}

async function calculateWinAndLoss(categoria) {
  const res = await baserow.list_rows(categoria, "Eliminazione");
  const data = transformData((await res.json())["results"]);

  const data_grouped = Object.groupBy(data, (v) => [
    v.Fase,
    v["Fase 2"],
    v.Ordine,
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
  // writeFileSync("./out/test.json", JSON.stringify(schema, null, 2));
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
  const data = transformData((await res.json())["results"]);
  res = await baserow.list_rows(categoria, "Squadre");
  const squadre = transformData((await res.json())["results"]);

  const data_grouped = Object.groupBy(data, (v) => [
    v.Fase,
    v["Fase 2"],
    v.Ordine,
  ]);

  const nodi = calculateInitialSchema();
  for (const key in nodi) {
    const nodo = nodi[key];
    const rows = data_grouped[key];
    let row = undefined;
    if (rows != undefined && rows.length > 0) {
      row = rows[0];
    }
    if (nodo != null) {
      if (row == undefined) {
        // Create the row if no match
        await baserow.create_row(categoria, "Eliminazione", {
          "Squadra 1": nodo.squadra1 ? squadre[nodo.squadra1 - 1]["Nome"] : [],
          "Squadra 2": nodo.squadra2 ? squadre[nodo.squadra2 - 1]["Nome"] : [],
          Fase: nodo.fase,
          "Fase 2": nodo.fase2,
          Ordine: nodo.ordine,
          Girone: "Gold",
        });
        continue;
      }
    } else {
      if (row != undefined) {
        await baserow.delete_row(categoria, "Eliminazione", row["id"]);
      }
      continue;
    }
    // Check if the first row is aligned
    // console.log(key, nodo.squadra1);
    let squadra1 = undefined;
    if (nodo.squadra1) {
      squadra1 = squadre[nodo.squadra1 - 1]["Nome"];
    }
    let squadra2 = undefined;
    if (nodo.squadra2) {
      squadra2 = squadre[nodo.squadra2 - 1]["Nome"];
    }
    if (row["Squadra 1"] !== squadra1 || row["Squadra 2"] !== squadra2) {
      const res = await baserow.modify_row(
        categoria,
        "Eliminazione",
        rows[0]["id"],
        {
          "Squadra 1": squadra1 || [],
          "Squadra 2": squadra2 || [],
        },
      );
    }
  }

  for (const key in data_grouped) {
    const rows = data_grouped[key];
    for (const row of rows.slice(1)) {
      await baserow.delete_row(categoria, "Eliminazione", row["id"]);
    }
    if (key in nodi) {
      continue;
    }
    console.log(rows[0]["id"]);
    await baserow.delete_row(categoria, "Eliminazione", rows[0]["id"]);
  }
}

async function deleteData(categoria) {
  const res = await baserow.list_rows(categoria, "Eliminazione");
  const data = transformData((await res.json())["results"]);

  const data_grouped = Object.groupBy(data, (v) => [v.Fase, v["Fase 2"]]);

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

// let res = await baserow.list_rows("MISTO", "Eliminazione");
// const data = transformData((await res.json())["results"]);
// console.log(data);

await loadInitialData("MISTO");

// const data = calculateInitialSchema();

// const schema = calculateSchema();

// writeFileSync("./out/test.json", JSON.stringify(data, null, 2));

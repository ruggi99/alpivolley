import { writeFileSync } from "node:fs";

import nextEnv from "@next/env";

import { algoritmo } from "./lib/algoritmo.js";
import { BaseRow, getRows, transformData } from "./lib/baserow.js";
import { calcClassificaAvulsa } from "./lib/classificaAvulsa.js";
import { FASI, FASI2 } from "./lib/const.js";
import { whoIsWinner } from "./lib/utils.js";

const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];

const NUMERO_FASI = 5;

const baserow = new BaseRow(BASEROW_TOKEN);

function calculateFakeAvulsa() {
  return Array(24) // E' 64
    .fill(0)
    .map((_, i) => "Squadra " + (i + 1).toString().padStart(2, "0"));
}

// Calcola lo schema come se ci fossero tutte le squadre
function calculateSchema(numero_fasi) {
  const data = {};
  for (let fase = 1; fase <= numero_fasi; fase++) {
    const algoritmoRet = algoritmo(fase);
    for (let i = 0; i < 2 ** (fase - 1); i++) {
      const obj = {
        fase: FASI[fase],
        fase2: "Diretta",
        ordine: i + 1,
        invalid: false,
        turno: Math.floor(i / 8) + 1,
        squadra1: algoritmoRet[i * 2],
        squadra2: algoritmoRet[i * 2 + 1],
      };
      if (i < 2 ** (fase - 2)) {
        obj.referees = [algoritmoRet[i * 2 + 2 ** (fase - 1) + 1], algoritmoRet[i * 2 + 2 ** (fase - 1)]];
      } else {
        obj.referees = [algoritmoRet[i * 2 - 2 ** (fase - 1) + 1], algoritmoRet[i * 2 - 2 ** (fase - 1)]];
      }
      obj.winner = {
        fase: FASI[fase - 1],
        fase2: "Diretta",
        ordine: parseInt(i / 2) + 1,
        squadra: (i % 2) + 1,
      };
      // Se è la prima fase non c'è ripescaggio
      if (fase == numero_fasi) {
        console.log(fase);
        // La prima fase diretta deve per forza essere divisa in due turni
        const turnoPrimaFase = Math.floor(i / (2 ** (fase - 1) / 2)) + 1;
        if (turnoPrimaFase > obj["turno"]) obj["turno"] = turnoPrimaFase;
        obj.looser = {
          fase: FASI[fase - 1],
          fase2: "Ripescaggio 1",
          referee: true,
        };
      } else if (fase == numero_fasi - 1) {
        obj.looser = {
          fase: FASI[fase - 1],
          fase2: "Ripescaggio 1",
          ordine: parseInt(i / 2) + 1,
          squadra: (i % 2) + 1,
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
    // Se c'è il ripescaggio. La prima fase non lo ha
    if (fase < numero_fasi - 1) {
      const algoritmoRet = algoritmo(fase + 1);
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const obj = {
          fase: FASI[fase],
          fase2: "Ripescaggio 1",
          ordine: i + 1,
          invalid: false,
          turno: Math.floor(i / 8) + 1,
          squadra1: algoritmoRet[i * 4 + 3],
          squadra2: algoritmoRet[i * 4 + 1],
          referees: [algoritmoRet[i * 4 + 2], algoritmoRet[i * 4 + 0]],
        };
        // L'ultima fase non ha vincitori
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
          invalid: false,
          turno: Math.floor(i / 8) + 1,
          squadra1: algoritmoRet[i * 4 + 2],
          squadra2: algoritmoRet[i * 4 + 3],
          referees: [algoritmoRet[i * 4 + 1], algoritmoRet[i * 4 + 0]],
        };
        // L'ultima fase non ha vincitori
        if (fase > 0) {
          obj.winner = {
            fase: FASI[fase - 1],
            // Dalla finale R2 si passa alla Finalissima diretta
            fase2: fase == 1 ? "Diretta" : "Ripescaggio 1",
            ordine: parseInt(i / 2) + 1,
            squadra: 2 - (i % 2),
          };
          // Dal ripescaggio 2 al ripescaggio 1 basta un singolo arbitro
          if (i % 2 == 1) {
            obj.looser = {
              fase: FASI[fase - 1],
              // Dalla finale R2 si passa alla Finalissima diretta
              fase2: fase == 1 ? "Diretta" : "Ripescaggio 1",
              ordine: parseInt(i / 2) + 1,
              referee: true,
            };
          } else {
            obj.looser = null;
          }
        }
        data[`${obj.fase},${obj.fase2},${obj.ordine}`] = obj;
      }
    }
  }
  // Aggiungo la Finalissima
  data[`${FASI[0]},Diretta,1`] = {
    fase: FASI[0],
    fase2: "Diretta",
    ordine: 1,
    invalid: false,
    turno: 1,
    winner: null,
    looser: null,
  };
  writeFileSync("./out/schema.json", JSON.stringify(data, null, 2));
  return data;
}

// Calcola il reale schema in base alle squadre presenti
async function calculateInitialSchema() {
  // Gold c'è sempre, Silver solo se > 16
  // const fakeAvulsa = calculateFakeAvulsa();
  const fakeAvulsa = calcClassificaAvulsa(await getRows("MISTO", "Gironi")).map((v) => v.Nome);
  console.log(fakeAvulsa);
  const FASE_PARTENZA = Math.min(Math.ceil(Math.log2(fakeAvulsa.length)), 5); // 5 = Sedicesimi
  // console.log(FASE_PARTENZA);
  const data = calculateSchema(FASE_PARTENZA);

  for (let fase = FASE_PARTENZA; fase > 0; fase--) {
    for (const fase2 of FASI2) {
      // La prima e l'ultima fase non hanno ripescaggio
      if ((fase == FASE_PARTENZA || fase == FASE_PARTENZA - 1 || fase == 0) && fase2 != "Diretta") {
        continue;
      }
      for (let i = 0; i < 2 ** (fase - 1); i++) {
        const key = `${FASI[fase]},${fase2},${i + 1}`;
        const thisData = data[key];
        const firstSqPos = thisData.squadra1;
        const secondSqPos = thisData.squadra2;

        const isFirstUndefined = firstSqPos === undefined;
        const isFirstValid = firstSqPos <= fakeAvulsa.length;
        const isFirstInvalid = !isFirstUndefined && !isFirstValid;
        const isSecondUndefined = secondSqPos === undefined;
        const isSecondValid = secondSqPos <= fakeAvulsa.length;
        const isSecondInvalid = !isSecondUndefined && !isSecondValid;

        // const atLeastOneUndefined = isFirstUndefined || isSecondUndefined;
        // const areAllDefined = !isFirstUndefined && !isSecondUndefined;
        const atLeastOneInvalid = isFirstInvalid || isSecondInvalid;
        // const areAllValid = isFirstValid && isSecondValid;

        if (isFirstUndefined) {
          // La squadra esiste e non è ancora definita -> propago l'undefined
          const winner = thisData.winner;
          data[`${winner.fase},${winner.fase2},${winner.ordine}`]["squadra" + winner.squadra] = undefined;
          data[`${winner.fase},${winner.fase2},${winner.ordine}`].referees = [];
        } else if (isFirstInvalid) {
          data[key].squadra1 = undefined;
        }

        if (isSecondUndefined) {
          // La squadra esiste o non è ancora definita -> propago l'undefined
          const looser = thisData.looser;
          if (looser && looser.referee === undefined) {
            // console.log(looser);
            data[`${looser.fase},${looser.fase2},${looser.ordine}`]["squadra" + looser.squadra] = undefined;
            data[`${looser.fase},${looser.fase2},${looser.ordine}`].referees = [];
          }
        } else if (isSecondInvalid) {
          data[key].squadra2 = undefined;
        }

        if (atLeastOneInvalid) {
          // Se almeno una delle due squadre non è valida, invalido la partita
          data[key].invalid = true;
        } else {
          if (isFirstValid) {
            // La squadra esiste e deve giocare questo turno -> prossimo turno è undefined
            const winner = thisData.winner;
            data[`${winner.fase},${winner.fase2},${winner.ordine}`]["squadra" + winner.squadra] = undefined;
            data[`${winner.fase},${winner.fase2},${winner.ordine}`].referees = [];
          }
          if (isSecondValid) {
            // La squadra esiste e deve giocare questo turno -> prossimo turno è undefined
            const looser = thisData.looser;
            if (looser && looser?.referee === undefined) {
              // console.log(looser);
              data[`${looser.fase},${looser.fase2},${looser.ordine}`]["squadra" + looser.squadra] = undefined;
              data[`${looser.fase},${looser.fase2},${looser.ordine}`].referees = [];
            }
          }
          for (const referee of thisData.referees) {
            if (referee <= fakeAvulsa.length) {
              data[key].referee = referee;
              data[key].referees = undefined;
              break;
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

  const data_grouped = Object.groupBy(data, (v) => [v.Fase, v["Fase 2"], v.Ordine]);

  // console.log(data);

  const calcMaxFase = Object.groupBy(data, (v) => [v.Fase]);

  // console.log(Object.keys(calcMaxFase).length - 1);

  // const schema = calculateSchema(Object.keys(calcMaxFase).length - 1);
  const schema = calculateInitialSchema(Object.keys(calcMaxFase).length - 1);
  const new_data = {};

  // const keys = Object.keys(data_grouped).filter((v) => v.startsWith("Ottavi"));
  const keys = Object.keys(data_grouped);
  // console.log(keys);
  keys.sort((a, b) => {
    // console.log(
    //   a.split(",")[0],
    //   FASI.indexOf(a.split(",")[0]),
    //   FASI.indexOf(b.split(",")[0]),
    // );
    return (FASI.indexOf(a.split(",")[0]) - FASI.indexOf(b.split(",")[0])) * -1;
  });
  // console.log(keys);

  // For cycle on real data
  for (const key of keys) {
    console.log(key);
    const row = data_grouped[key][0];
    const whoWinner = whoIsWinner(row);
    console.log(whoWinner);
    if (whoWinner == 0) {
      continue;
    }
    for (const type of ["winner", "looser"]) {
      const obj = schema[key][type];
      if (obj === null) {
        // Sei fuori dal torneo
        continue;
      }
      // console.log("schema type", schema[key]);
      const key2 = `${obj.fase},${obj.fase2},${obj.ordine}`;
      // console.log(type, key2);
      const temp_obj = schema[key2];
      if (!(key2 in new_data)) {
        new_data[key2] = {};
      }
      new_data[key2].invalid = temp_obj.invalid;
      if (type == "winner") {
        new_data[key2]["squadra" + obj.squadra] = row["Squadra " + whoWinner];
      } else if (obj.referee) {
        new_data[key2]["arbitro"] = row["Squadra " + (3 - whoWinner)];
      } else {
        new_data[key2]["squadra" + obj.squadra] = row["Squadra " + (3 - whoWinner)];
      }
    }
  }
  console.log(new_data);
  // writeFileSync("./out/test.json", JSON.stringify(schema, null, 2));
  await applyDifferences(categoria, "Eliminazione", data_grouped, new_data);
}

async function applyDifferences(categoria, fase, data_grouped, new_data) {
  // console.log(new_data);
  for (const key in new_data) {
    // if (!(key in data_grouped)) continue;
    // console.log(key);
    const data = new_data[key];
    // if (data.invalid) continue;
    const old_data = data_grouped[key][0];
    if (
      (data.squadra1 && data.squadra1 != old_data["Squadra 1"]) ||
      (data.squadra2 && data.squadra2 != old_data["Squadra 2"])
      // (data.arbitro && data.arbitro != old_data["Arbitro"])
    ) {
      await baserow.modify_row(categoria, fase, old_data["id"], {
        "Squadra 1": data.squadra1,
        "Squadra 2": data.squadra2,
        // Arbitro: data.arbitro,
      });
    }
    if (data.invalid && (old_data["Punti 1"] != 21 || old_data["Punti 2"] != 0)) {
      await baserow.modify_row(categoria, "Eliminazione", old_data["id"], {
        "Punti 1": 21,
        "Punti 2": 0,
      });
    }
  }
}

export async function loadInitialData(categoria) {
  let res = await baserow.list_rows(categoria, "Eliminazione");
  const data = transformData((await res.json())["results"]);
  res = await baserow.list_rows(categoria, "Squadre");
  const squadre = transformData((await res.json())["results"]);

  const data_grouped = Object.groupBy(data, (v) => [v.Fase, v["Fase 2"], v.Ordine]);

  const nodi = await calculateInitialSchema();
  for (const key in nodi) {
    const nodo = nodi[key];
    const rows = data_grouped[key];
    let row = undefined;
    if (rows != undefined && rows.length > 0) {
      row = rows[0];
    }
    if (row == undefined) {
      // Create the row if no match
      await baserow.create_row(categoria, "Eliminazione", {
        "Squadra 1": nodo.squadra1 ? squadre[nodo.squadra1 - 1]["Nome"] : [],
        "Squadra 2": nodo.squadra2 ? squadre[nodo.squadra2 - 1]["Nome"] : [],
        Fase: nodo.fase,
        "Fase 2": nodo.fase2,
        Ordine: nodo.ordine,
        // Arbitro: nodo.referee,
        Turno: nodo.turno?.toString(),
        Girone: "Gold",
      });
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
    let referee = undefined;
    if (nodo.referee) {
      referee = squadre[nodo.referee - 1]["Nome"];
    }
    let turno = undefined;
    if (nodo.turno) {
      turno = nodo.turno.toString();
    }
    console.log(squadra1, squadra2);
    if (
      row["Squadra 1"] !== squadra1 ||
      row["Squadra 2"] !== squadra2 ||
      // row["Arbitro"] !== referee ||
      row["Turno"] !== turno
    ) {
      // console.log(row["Turno"] !== turno, row["Turno"], turno);
      await baserow.modify_row(categoria, "Eliminazione", rows[0]["id"], {
        "Squadra 1": squadra1 || [],
        "Squadra 2": squadra2 || [],
        // Arbitro: referee || [],
        Turno: turno,
      });
      // console.log(await res.text());
    }
    if (nodo.invalid && (row["Punti 1"] != 21 || row["Punti 2"] != 0)) {
      await baserow.modify_row(categoria, "Eliminazione", rows[0]["id"], {
        "Punti 1": 21,
        "Punti 2": 0,
      });
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
    // console.log(rows[0]["id"]);
    await baserow.delete_row(categoria, "Eliminazione", rows[0]["id"]);
  }
}

export async function deleteData(categoria) {
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
    const rows = data_grouped[`${fase_str},${nodo.fase2}`]?.filter((v) => v["Ordine"] == nodo.ordine + 1);
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
// await calculateWinAndLoss("MISTO");

// const data = await calculateInitialSchema();

// const schema = calculateSchema(5);

// writeFileSync("./out/schema.json", JSON.stringify(schema, null, 2));

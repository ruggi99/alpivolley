import nextEnv from "@next/env";

import { algoritmo } from "./lib/algoritmo.js";
import { BASEROW_API_URL } from "./lib/baserow.js";
import { FASI, FASI2 } from "./lib/const.js";
const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const ALPHABET = "abcdefg";

const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];

const NUMERO_FASI = 4;

async function fetch2(...args) {
  return fetch(...args);
}

async function main(categoria) {
  let res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
    {
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
      },
    },
  );
  const data = (await res.json())["results"];
  res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/134207/?user_field_names=true&order_by=Nome`,
    {
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
      },
    },
  );
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
      await fetch2(
        `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${BASEROW_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
            "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
            Fase: `${ALPHABET[nodo.fase]}${fase_str}`,
            "Fase 2": nodo.fase2,
            Ordine: nodo.ordine + 1,
          }),
        },
      );
      continue;
    }
    // Check if the first row is aligned
    if (
      rows[0]["Squadra 1"][0]["value"] != squadre[nodo.squadra1 - 1]["Nome"] ||
      rows[0]["Squadra 2"][0]["value"] != squadre[nodo.squadra2 - 1]["Nome"]
    ) {
      await fetch2(
        `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${BASEROW_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
            "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
          }),
        },
      );
    }
  }
}

async function deleteData(categoria) {
  const res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
    {
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`,
      },
    },
  );
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
    await fetch2(
      `${BASEROW_API_URL}/api/database/rows/table/333631/${data_to_d["id"]}/?user_field_names=true`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${BASEROW_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

await deleteData("U13M");

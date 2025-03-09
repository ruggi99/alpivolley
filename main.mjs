import { algoritmo } from "./lib/algoritmo.mjs";

const NUMERO_FASI = 3;
const BASEROW_API_URL = "https://api.baserow.io";

const FASI = [
  "Finalissima",
  "Finali",
  "Semifinali",
  "Quarti",
  "Ottavi",
  "Sedicesimi",
  "Trentaduesimi",
];

const FASI2 = ["Diretta", "Ripescaggio 1", "Ripescaggio 2"];

const ALPHABET = "abcdefg";

async function groupBy(data, func, squadre) {
  const baserowToken = process.env["BASEROW_TOKEN"];
  const data_grouped = Object.groupBy(data, func);
  for (let fase = 0; fase < 5; fase++) {
    const fase_str = FASI[fase];
    for (const fase2 of FASI2) {
      const nodi = [];
      if (fase2 == FASI2[0]) {
        const _nodi = algoritmo(Math.max(fase, 1));
        for (let i = 0; i < _nodi.length / 2; i++) {
          nodi.push({
            squadra1: _nodi[i * 2],
            squadra2: _nodi[i * 2 + 1],
          });
        }
      } else if (fase2 == FASI2[1] && fase > 0) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 3],
            squadra2: _nodi[i * 4 + 1],
          });
        }
      } else if (fase2 == FASI2[2] && fase > 0) {
        const _nodi = algoritmo(Math.max(fase + 1, 2));
        for (let i = 0; i < _nodi.length / 4; i++) {
          nodi.push({
            squadra1: _nodi[i * 4 + 2],
            squadra2: _nodi[i * 4 + 3],
          });
        }
      }
      for (let i = 0; i < nodi.length; i++) {
        const nodo = nodi[i];
        const rows = data_grouped[`${fase_str},${fase2}`]?.filter(
          (v) => v["Ordine"] == i + 1,
        );
        if (rows == undefined || rows.length == 0) {
          // Create the row if no match
          const res = await fetch(
            `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
            {
              method: "POST",
              headers: {
                Authorization: `Token ${baserowToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
                "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
                Fase: `${ALPHABET[fase]}${fase_str}`,
                "Fase 2": fase2,
                Ordine: i + 1,
              }),
            },
          );
          console.log(await res.json());
          continue;
        }
        // Check if the first row is aligned
        if (
          rows[0]["Squadra 1"][0]["value"] !=
            squadre[nodo.squadra1 - 1]["Nome"] ||
          rows[0]["Squadra 2"][0]["value"] != squadre[nodo.squadra2 - 1]["Nome"]
        ) {
          const res = await fetch(
            `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Token ${baserowToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "Squadra 1": squadre[nodo.squadra1 - 1]["Nome"],
                "Squadra 2": squadre[nodo.squadra2 - 1]["Nome"],
              }),
            },
          );
          console.log(await res.json());
        }
        // Delete all rows duplicated
        for (let i = 1; i < rows.length; i++) {
          await fetch(
            `${BASEROW_API_URL}/api/database/rows/table/333631/${rows[i]["id"]}/?user_field_names=true`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Token ${baserowToken}`,
                "Content-Type": "application/json",
              },
            },
          );
        }
      }
    }
  }
}

async function main() {
  const initial_data = algoritmo(NUMERO_FASI);
  const baserowToken = process.env["BASEROW_TOKEN"];
  const url = `${BASEROW_API_URL}/api/database/rows/table/333631/?user_field_names=true`;
  let res = await fetch(url, {
    headers: {
      Authorization: `Token ${baserowToken}`,
    },
  });
  const data_raw = await res.json();
  res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/134207/?user_field_names=true&order_by=Nome`,
    {
      headers: {
        Authorization: `Token ${baserowToken}`,
      },
    },
  );
  const squadre_raw = await res.json();
  // console.log(squadre_raw);
  const data_grouped = groupBy(
    data_raw.results,
    (v, i) => [v.Fase["value"].substr(1), v["Fase 2"]["value"]],
    squadre_raw.results,
  );
}

await main();

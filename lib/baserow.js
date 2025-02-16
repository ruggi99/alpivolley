import { GIRONI } from "./const";

export const BASEROW_API_URL = "https://api.baserow.io";

const TABLES = {
  U13M: {
    Squadre: 134207,
    Gironi: 134206,
    Eliminazione: 333631,
  },
};

function transformData(data) {
  data.forEach((w) => {
    Object.entries(w).forEach(([k, v]) => {
      if (["Squadra 1", "Squadra 2", "Arbitro"].includes(k)) {
        w[k] = v[0]["value"];
      } else if (["Girone", "Fase", "Turno"].includes(k)) {
        w[k] = v["value"];
      }
    });
  });
  return data;
}

function orderBy(row) {
  return [row["Fase"], row["Turno"]];
}

export const FASI = [
  "32simi",
  "16simi",
  "Ottavi",
  "Quarti",
  "Semifinali",
  "Finali",
];
const TURNI = Array(8)
  .fill(0)
  .map((_, i) => (i + 1).toString());

function groupByEliminazione(data) {
  // console.log(data)
  const returnData = [];
  const tempData = {};
  for (const k1 of FASI) {
    tempData[k1] = {};
    for (const k2 of TURNI) {
      tempData[k1][k2] = [];
    }
  }
  data.forEach((v) => {
    const [k1, k2] = orderBy(v);
    tempData[k1][k2].push(v);
  });
  return tempData;
}

// cat -> categoria (U13M, U13F, ecc)
// tipo -> Squadre, Gironi, Eliminazione
export async function getRows(cat, tipo, girone = undefined) {
  const baserowToken = process.env["BASEROW_TOKEN"];
  let url = `${BASEROW_API_URL}/api/database/rows/table/${TABLES[cat][tipo]}/?user_field_names=true`;
  if (tipo == "Gironi" && girone) {
    url += `&filter__Girone__contains=${GIRONI[girone]}`;
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${baserowToken}`,
    },
  });
  let data = await res.json();
  data = transformData(data.results);
  if (tipo == "Eliminazione") {
    data = groupByEliminazione(data);
  }
  return data;
}

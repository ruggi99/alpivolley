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
    // console.log(w === data[0]);
    Object.entries(w).forEach(([k, v]) => {
      // console.log(v === w[k]);
      if (["Squadra 1", "Squadra 2", "Arbitro"].includes(k)) {
        w[k] = v[0]["value"];
      } else if (["Girone"].includes(k)) {
        w[k] = v["value"];
      }
    });
  });
  // console.log(data);
  return data;
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
  const data = await res.json();
  return transformData(data.results);
}

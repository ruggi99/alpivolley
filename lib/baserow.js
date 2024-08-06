import { GIRONI } from "./const";

export const BASEROW_API_URL = "https://api.baserow.io";

const TABLES = {
  U13M: {
    Squadre: 134207,
    Gironi: 134206,
    Eliminazione: 333631,
  },
};

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
  return res.json();
}

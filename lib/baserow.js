import { GIRONI } from "./const.js";

const BASEROW_API_URL = "https://api.baserow.io";

export const TABLES = {
  U13M: {
    Squadre: 134207,
    Gironi: 134206,
    Eliminazione: 333631,
  },
};

export function transformData(data) {
  data.forEach((w) => {
    // console.log(w === data[0]);
    Object.entries(w).forEach(([k, v]) => {
      // console.log(v === w[k]);
      if (["Squadra 1", "Squadra 2", "Arbitro"].includes(k)) {
        if (!v.length) return;
        w[k] = v[0]["value"];
      } else if (["Girone", "Fase", "Fase 2"].includes(k)) {
        w[k] = v["value"];
      }
    });
  });
  return data;
}

export class BaseRow {
  constructor(token) {
    this.token = token;
  }

  async create_row(cat, fase, body) {
    const table_id = TABLES[cat][fase];
    return fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${table_id}/?user_field_names=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
  }

  async list_rows(cat, fase) {
    const table_id = TABLES[cat][fase];
    return fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${table_id}/?user_field_names=true`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      },
    );
  }

  async modify_row(cat, fase, row_id, body) {
    const table_id = TABLES[cat][fase];
    return fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${table_id}/${row_id}/?user_field_names=true`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.token}`,
        },
        body: JSON.stringify(body),
      },
    );
  }

  async delete_row(cat, fase, row_id) {
    const table_id = TABLES[cat][fase];
    return fetch(
      `${BASEROW_API_URL}/api/database/rows/table/${table_id}/${row_id}/?user_field_names=true`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }
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

const BASEROW_API_URL = "https://api.baserow.io";

export const TABLES = {
  MISTO: {
    Squadre: 134207,
    Gironi: 134206,
    Eliminazione: 333631,
    Controlli: 643724,
  },
};

export function transformData(data) {
  data.forEach((w) => {
    Object.entries(w).forEach(([k, v]) => {
      if (["Squadra 1", "Squadra 2", "Arbitro"].includes(k)) {
        if (!v.length) {
          w[k] = null;
        } else {
          w[k] = v[0]["value"];
        }
      } else if (["Girone", "Fase", "Fase 2", "Turno"].includes(k)) {
        if (v) w[k] = v["value"];
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
    return fetch(`${BASEROW_API_URL}/api/database/rows/table/${table_id}/?user_field_names=true`, {
      method: "POST",
      headers: {
        Authorization: `Token ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async get_row(cat, fase, row_id) {
    const table_id = TABLES[cat][fase];
    return fetch(`${BASEROW_API_URL}/api/database/rows/table/${table_id}/${row_id}/?user_field_names`, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  async list_rows(cat, fase) {
    const table_id = TABLES[cat][fase];
    return fetch(`${BASEROW_API_URL}/api/database/rows/table/${table_id}/?user_field_names=true`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  async modify_row(cat, fase, row_id, body) {
    const table_id = TABLES[cat][fase];
    return fetch(`${BASEROW_API_URL}/api/database/rows/table/${table_id}/${row_id}/?user_field_names=true`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async delete_row(cat, fase, row_id) {
    const table_id = TABLES[cat][fase];
    return fetch(`${BASEROW_API_URL}/api/database/rows/table/${table_id}/${row_id}/?user_field_names=true`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

// cat -> categoria (U13M, U13F, ecc)
// tipo -> Squadre, Gironi, Eliminazione
export async function getRows(cat, tipo, girone = undefined) {
  const baserowToken = process.env["BASEROW_TOKEN"];
  const url = `${BASEROW_API_URL}/api/database/rows/table/${TABLES[cat][tipo]}/`;
  const params = new URLSearchParams();
  params.append("user_field_names", true);
  params.append("size", 200);
  params.append("filter_type", "OR");
  if (girone) {
    if (!Array.isArray(girone)) girone = [girone];
    for (const g of girone) {
      params.append("filter__Girone__contains", g);
    }
  }
  const res = await fetch(`${url}?${params}`, {
    headers: {
      Authorization: `Token ${baserowToken}`,
    },
  });
  const data = await res.json();
  return transformData(data.results);
}

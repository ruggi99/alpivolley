import nextEnv from "@next/env";

import { BaseRow } from "#root/lib/baserow.js";
import { TABLES } from "#root/lib/baserow.js";

const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];

const baserow = new BaseRow(BASEROW_TOKEN);

export async function deleteAllData() {
  for (const categoria in TABLES) {
    for (const nomeTabella in TABLES[categoria]) {
      if (nomeTabella == "Controlli") continue;
      console.log(nomeTabella);

      const res = (await baserow.list_rows(categoria, nomeTabella).then((v) => v.json()))["results"];
      for (const row of res) {
        await baserow.delete_row(categoria, nomeTabella, row["id"]);
      }
    }
  }
}

await deleteAllData();

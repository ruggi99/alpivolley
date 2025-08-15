import nextEnv from "@next/env";

import { BaseRow, getRows } from "./lib/baserow.js";

const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const SCHEMA_GIRONI = {
  A: {
    squadre: [
      "LE 4 GRAZIE",
      "I CAMPIONI DELLA CACIARA",
      "TUTTAPOSTO A FERRAGOSTO",
      "BALDI-NO",
      "FOR THE PLOT",
      "GOTTA SINDACO",
    ],
    campo: 1,
  },
  B: {
    squadre: [
      "4 GNOCCHI AL RAGU'",
      "TUTTO ROTTO TRANNE IL CULO",
      "SIETE PROPRIO SCARSI",
      "QUELLI AL CAMPO 3",
      "CHI CE LO HA FATTO FARE",
      "HIGHLIGHTERS",
    ],
    campo: 4,
  },
  C: {
    squadre: [
      "NON C'E' RIPPA PER MATI",
      "I BASSI NIC DELLA STRADA",
      "CERVELLI PRESTATI ALL'AGRICOLTURA",
      "POLENTA E GIANDUIOTTI",
      "I BOCI",
      "GREENVONLYFANS",
    ],
    campo: 6,
  },
  D: {
    squadre: [
      "SCIMMIE INSIEME FORTI",
      "BAGATATA",
      "EMARGINA L'ASTEMIO O FALLO GUIDARE",
      "DAMMI UN BRR",
      "WISCONSIN",
      "GRILL VOLLEY",
    ],
    campo: 9,
  },
};

const START_TIME = new Date(2025, 7, 16, 9, 10, 0);
const MINUTES = 20;

const SCHEMA_PARTITE_6 = [
  {
    squadra1: 1,
    squadra2: 6,
    arbitro: 2,
    campo: 1,
    slot: 1,
  },
  {
    squadra1: 2,
    squadra2: 5,
    arbitro: 1,
    campo: 1,
    slot: 2,
  },
  {
    squadra1: 3,
    squadra2: 4,
    arbitro: 6,
    campo: 2,
    slot: 2,
  },
  {
    squadra1: 2,
    squadra2: 4,
    arbitro: 5,
    campo: 1,
    slot: 3,
  },
  {
    squadra1: 1,
    squadra2: 5,
    arbitro: 2,
    campo: 1,
    slot: 4,
  },
  {
    squadra1: 3,
    squadra2: 6,
    arbitro: 4,
    campo: 2,
    slot: 4,
  },
  {
    squadra1: 5,
    squadra2: 6,
    arbitro: 3,
    campo: 1,
    slot: 5,
  },
  {
    squadra1: 1,
    squadra2: 4,
    arbitro: 5,
    campo: 1,
    slot: 6,
  },
  {
    squadra1: 2,
    squadra2: 3,
    arbitro: 6,
    campo: 2,
    slot: 6,
  },
  {
    squadra1: 1,
    squadra2: 3,
    arbitro: 4,
    campo: 1,
    slot: 7,
  },
  {
    squadra1: 2,
    squadra2: 6,
    arbitro: 1,
    campo: 1,
    slot: 8,
  },
  {
    squadra1: 4,
    squadra2: 5,
    arbitro: 3,
    campo: 2,
    slot: 8,
  },
  {
    squadra1: 3,
    squadra2: 5,
    arbitro: 1,
    campo: 1,
    slot: 9,
  },
  {
    squadra1: 1,
    squadra2: 2,
    arbitro: 3,
    campo: 1,
    slot: 10,
  },
  {
    squadra1: 4,
    squadra2: 6,
    arbitro: 5,
    campo: 2,
    slot: 10,
  },
];

const SCHEMA_PARTITE_3 = [
  {
    squadra1: 1,
    squadra2: 2,
    arbitro: 3,
    campo: 1,
    slot: 1,
  },
  {
    squadra1: 2,
    squadra2: 3,
    arbitro: 1,
    campo: 1,
    slot: 2,
  },
  {
    squadra1: 3,
    squadra2: 1,
    arbitro: 2,
    campo: 1,
    slot: 3,
  },
];

async function main() {
  const baserow = new BaseRow(process.env.BASEROW_TOKEN);
  const gironi = Object.keys(SCHEMA_GIRONI);
  const partite = await getRows("MISTO", "Gironi", gironi);
  const squadre = await getRows("MISTO", "Squadre");
  const nomi_squadre = squadre.map((v) => v.Nome);
  for (const girone of gironi) {
    // Controllo che le squadre esistano
    const squadre_girone = SCHEMA_GIRONI[girone].squadre;
    for (const sq of squadre_girone) {
      if (!nomi_squadre.includes(sq)) {
        await baserow.create_row("MISTO", "Squadre", {
          Nome: sq,
        });
      }
    }
    // Confronto la partita generata con le partite già presenti
    for (const partite_schema of SCHEMA_PARTITE_3) {
      const orario = new Date(START_TIME.getTime() + (partite_schema.slot - 1) * MINUTES * 60 * 1000).toISOString();
      const partita = {
        Girone: girone,
        "Squadra 1": squadre_girone[partite_schema.squadra1 - 1],
        "Squadra 2": squadre_girone[partite_schema.squadra2 - 1],
        Arbitro: squadre_girone[partite_schema.arbitro - 1],
        Campo: SCHEMA_GIRONI[girone].campo + partite_schema.campo - 1,
        Orario: orario.substring(0, 19) + "Z",
      };
      const index = partite.findIndex(
        (v) =>
          v.Girone == partita.Girone &&
          v["Squadra 1"] == partita["Squadra 1"] &&
          v["Squadra 2"] == partita["Squadra 2"] &&
          v.Arbitro == partita.Arbitro &&
          v.Campo == partita.Campo &&
          v.Orario == partita.Orario,
      );
      // Nascondo la partita dalle partite esistenti
      if (index != -1) {
        partite.splice(index, 1);
        continue;
      }
      // Crea la partita che non è stata trovata
      await baserow.create_row("MISTO", "Gironi", partita).catch(console.log);
    }
  }
  // Elimino le partite che non sono state trovate nello schema
  for (const partita of partite) {
    await baserow.delete_row("MISTO", "Gironi", partita.id);
  }
}

await main();

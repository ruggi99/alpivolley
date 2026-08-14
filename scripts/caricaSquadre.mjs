import nextEnv from "@next/env";

import { BaseRow, getRows } from "#root/lib/baserow.js";

const { loadEnvConfig } = nextEnv;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Importante non mettere nomi contenenti virgole, a Baserow non piacciono
const SCHEMA_GIRONI = {
  A: {
    squadre: [
      "TEAM NO JUMP ZONE",
      "STRIGOPS",
      "MILANESE 7",
      "VABBÈ BIRRETTA?",
      "TUTTO ROTTO TRANNE IL CULO",
      "L'OKI È L'UNICA COSA CHE CONTA",
      "EH PERÒ",
      "FERRARROSTO",
      "UNDER BALLS",
      "NA'VI",
      "BORGO BIO",
      "WINNIE THE PUSHER",
      "LE FATINE DI LEO",
    ],
    campo: 1,
  },
  B: {
    squadre: [
      "VERGINE VALSUGANA",
      "JAKIE CAN",
      "GTA 6 CALABRIA",
      "WISCONSIN",
      "MEGLIO TARDI CHE MAIS",
      "SPIX",
      "PUZZACERTOLI",
      "COSTA MA NE VALE LA PENA",
      "TIRO A CAMPARI",
      "RHENZ PREGA PER NOI",
      "I FINALISTI",
      "LE 3 GRAZIE",
      "SUPER! IL CULO",
    ],
    campo: 6,
  },
};

// Il mese è un indice che va da 0 a 11, quindi 7 è agosto
const START_TIME = new Date(2026, 7, 15, 9, 0, 0);
const MINUTES = 20;

const SCHEMA_PARTITE_12 = [
  { squadra1: 12, squadra2: 1, arbitro: 3, campo: 1, slot: 1 },
  { squadra1: 2, squadra2: 11, arbitro: 4, campo: 3, slot: 1 },

  { squadra1: 3, squadra2: 10, arbitro: 1, campo: 1, slot: 2 },
  { squadra1: 4, squadra2: 9, arbitro: 2, campo: 3, slot: 2 },
  { squadra1: 5, squadra2: 8, arbitro: 6, campo: 5, slot: 2 },

  { squadra1: 6, squadra2: 7, arbitro: 8, campo: 1, slot: 3 },
  { squadra1: 12, squadra2: 2, arbitro: 9, campo: 3, slot: 3 },

  { squadra1: 3, squadra2: 1, arbitro: 7, campo: 1, slot: 4 },
  { squadra1: 4, squadra2: 11, arbitro: 8, campo: 3, slot: 4 },
  { squadra1: 5, squadra2: 10, arbitro: 12, campo: 5, slot: 4 },

  { squadra1: 6, squadra2: 9, arbitro: 3, campo: 1, slot: 5 },
  { squadra1: 7, squadra2: 8, arbitro: 4, campo: 3, slot: 5 },

  { squadra1: 12, squadra2: 3, arbitro: 6, campo: 1, slot: 6 },
  { squadra1: 4, squadra2: 2, arbitro: 9, campo: 3, slot: 6 },
  { squadra1: 5, squadra2: 1, arbitro: 10, campo: 5, slot: 6 },

  { squadra1: 6, squadra2: 11, arbitro: 1, campo: 1, slot: 7 },
  { squadra1: 7, squadra2: 10, arbitro: 2, campo: 3, slot: 7 },

  { squadra1: 8, squadra2: 9, arbitro: 7, campo: 1, slot: 8 },
  { squadra1: 12, squadra2: 4, arbitro: 2, campo: 3, slot: 8 },
  { squadra1: 5, squadra2: 3, arbitro: 11, campo: 5, slot: 8 },

  { squadra1: 6, squadra2: 2, arbitro: 3, campo: 1, slot: 9 },
  { squadra1: 7, squadra2: 1, arbitro: 5, campo: 3, slot: 9 },

  { squadra1: 8, squadra2: 11, arbitro: 1, campo: 1, slot: 10 },
  { squadra1: 9, squadra2: 10, arbitro: 6, campo: 3, slot: 10 },
  { squadra1: 12, squadra2: 5, arbitro: 7, campo: 5, slot: 10 },

  { squadra1: 6, squadra2: 4, arbitro: 5, campo: 1, slot: 11 },
  { squadra1: 7, squadra2: 3, arbitro: 11, campo: 3, slot: 11 },

  { squadra1: 8, squadra2: 2, arbitro: 4, campo: 1, slot: 12 },
  { squadra1: 9, squadra2: 1, arbitro: 5, campo: 3, slot: 12 },
  { squadra1: 10, squadra2: 11, arbitro: 12, campo: 5, slot: 12 },

  { squadra1: 12, squadra2: 6, arbitro: 3, campo: 1, slot: 13 },
  { squadra1: 7, squadra2: 5, arbitro: 9, campo: 3, slot: 13 },

  { squadra1: 8, squadra2: 4, arbitro: 5, campo: 1, slot: 14 },
  { squadra1: 9, squadra2: 3, arbitro: 6, campo: 3, slot: 14 },
  { squadra1: 10, squadra2: 2, arbitro: 11, campo: 5, slot: 14 },

  { squadra1: 11, squadra2: 1, arbitro: 4, campo: 1, slot: 15 },
  { squadra1: 12, squadra2: 7, arbitro: 10, campo: 3, slot: 15 },

  { squadra1: 8, squadra2: 6, arbitro: 1, campo: 1, slot: 16 },
  { squadra1: 9, squadra2: 5, arbitro: 3, campo: 3, slot: 16 },
  { squadra1: 10, squadra2: 4, arbitro: 12, campo: 5, slot: 16 },

  { squadra1: 11, squadra2: 3, arbitro: 6, campo: 1, slot: 17 },
  { squadra1: 1, squadra2: 2, arbitro: 10, campo: 3, slot: 17 },

  { squadra1: 12, squadra2: 8, arbitro: 2, campo: 1, slot: 18 },
  { squadra1: 9, squadra2: 7, arbitro: 4, campo: 3, slot: 18 },
  { squadra1: 10, squadra2: 6, arbitro: 11, campo: 5, slot: 18 },

  { squadra1: 11, squadra2: 5, arbitro: 7, campo: 1, slot: 19 },
  { squadra1: 1, squadra2: 4, arbitro: 8, campo: 3, slot: 19 },

  { squadra1: 2, squadra2: 3, arbitro: 1, campo: 1, slot: 20 },
  { squadra1: 12, squadra2: 9, arbitro: 4, campo: 3, slot: 20 },
  { squadra1: 10, squadra2: 8, arbitro: 5, campo: 5, slot: 20 },

  { squadra1: 11, squadra2: 7, arbitro: 9, campo: 1, slot: 21 },
  { squadra1: 1, squadra2: 6, arbitro: 12, campo: 3, slot: 21 },

  { squadra1: 2, squadra2: 5, arbitro: 6, campo: 1, slot: 22 },
  { squadra1: 3, squadra2: 4, arbitro: 7, campo: 3, slot: 22 },
  { squadra1: 12, squadra2: 10, arbitro: 11, campo: 5, slot: 22 },

  { squadra1: 11, squadra2: 9, arbitro: 2, campo: 1, slot: 23 },
  { squadra1: 1, squadra2: 8, arbitro: 10, campo: 3, slot: 23 },

  { squadra1: 2, squadra2: 7, arbitro: 8, campo: 1, slot: 24 },
  { squadra1: 3, squadra2: 6, arbitro: 10, campo: 3, slot: 24 },
  { squadra1: 4, squadra2: 5, arbitro: 12, campo: 5, slot: 24 },

  { squadra1: 12, squadra2: 11, arbitro: 3, campo: 1, slot: 25 },
  { squadra1: 1, squadra2: 10, arbitro: 5, campo: 3, slot: 25 },
  { squadra1: 2, squadra2: 9, arbitro: 7, campo: 5, slot: 25 },

  { squadra1: 3, squadra2: 8, arbitro: 1, campo: 1, slot: 26 },
  { squadra1: 4, squadra2: 7, arbitro: 10, campo: 3, slot: 26 },
  { squadra1: 5, squadra2: 6, arbitro: 12, campo: 5, slot: 26 },
];

const SCHEMA_PARTITE_13 = [
  { squadra1: 1, squadra2: 13, arbitro: 4, campo: 1, slot: 1 },
  { squadra1: 2, squadra2: 12, arbitro: 5, campo: 3, slot: 1 },
  { squadra1: 3, squadra2: 11, arbitro: 6, campo: 5, slot: 1 },

  { squadra1: 4, squadra2: 10, arbitro: 1, campo: 1, slot: 2 },
  { squadra1: 5, squadra2: 9, arbitro: 2, campo: 3, slot: 2 },
  { squadra1: 6, squadra2: 8, arbitro: 3, campo: 5, slot: 2 },

  { squadra1: 13, squadra2: 12, arbitro: 7, campo: 1, slot: 3 },
  { squadra1: 1, squadra2: 11, arbitro: 8, campo: 3, slot: 3 },
  { squadra1: 2, squadra2: 10, arbitro: 9, campo: 5, slot: 3 },

  { squadra1: 3, squadra2: 9, arbitro: 10, campo: 1, slot: 4 },
  { squadra1: 4, squadra2: 8, arbitro: 11, campo: 3, slot: 4 },
  { squadra1: 5, squadra2: 7, arbitro: 12, campo: 5, slot: 4 },

  { squadra1: 12, squadra2: 11, arbitro: 2, campo: 1, slot: 5 },
  { squadra1: 13, squadra2: 10, arbitro: 3, campo: 3, slot: 5 },
  { squadra1: 1, squadra2: 9, arbitro: 4, campo: 5, slot: 5 },

  { squadra1: 2, squadra2: 8, arbitro: 13, campo: 1, slot: 6 },
  { squadra1: 3, squadra2: 7, arbitro: 1, campo: 3, slot: 6 },
  { squadra1: 4, squadra2: 6, arbitro: 5, campo: 5, slot: 6 },

  { squadra1: 11, squadra2: 10, arbitro: 6, campo: 1, slot: 7 },
  { squadra1: 12, squadra2: 9, arbitro: 7, campo: 3, slot: 7 },
  { squadra1: 13, squadra2: 8, arbitro: 1, campo: 5, slot: 7 },

  { squadra1: 1, squadra2: 7, arbitro: 8, campo: 1, slot: 8 },
  { squadra1: 2, squadra2: 6, arbitro: 9, campo: 3, slot: 8 },
  { squadra1: 3, squadra2: 5, arbitro: 10, campo: 5, slot: 8 },

  { squadra1: 10, squadra2: 9, arbitro: 13, campo: 1, slot: 9 },
  { squadra1: 11, squadra2: 8, arbitro: 2, campo: 3, slot: 9 },
  { squadra1: 12, squadra2: 7, arbitro: 3, campo: 5, slot: 9 },

  { squadra1: 13, squadra2: 6, arbitro: 11, campo: 1, slot: 10 },
  { squadra1: 1, squadra2: 5, arbitro: 12, campo: 3, slot: 10 },
  { squadra1: 2, squadra2: 4, arbitro: 7, campo: 5, slot: 10 },

  { squadra1: 9, squadra2: 8, arbitro: 4, campo: 1, slot: 11 },
  { squadra1: 10, squadra2: 7, arbitro: 5, campo: 3, slot: 11 },
  { squadra1: 11, squadra2: 6, arbitro: 12, campo: 5, slot: 11 },

  { squadra1: 12, squadra2: 5, arbitro: 6, campo: 1, slot: 12 },
  { squadra1: 13, squadra2: 4, arbitro: 8, campo: 3, slot: 12 },
  { squadra1: 1, squadra2: 3, arbitro: 9, campo: 5, slot: 12 },

  { squadra1: 8, squadra2: 7, arbitro: 11, campo: 1, slot: 13 },
  { squadra1: 9, squadra2: 6, arbitro: 13, campo: 3, slot: 13 },
  { squadra1: 10, squadra2: 5, arbitro: 1, campo: 5, slot: 13 },

  { squadra1: 11, squadra2: 4, arbitro: 10, campo: 1, slot: 14 },
  { squadra1: 12, squadra2: 3, arbitro: 5, campo: 3, slot: 14 },
  { squadra1: 13, squadra2: 2, arbitro: 6, campo: 5, slot: 14 },

  { squadra1: 7, squadra2: 6, arbitro: 2, campo: 1, slot: 15 },
  { squadra1: 8, squadra2: 5, arbitro: 3, campo: 3, slot: 15 },
  { squadra1: 9, squadra2: 4, arbitro: 10, campo: 5, slot: 15 },

  { squadra1: 10, squadra2: 3, arbitro: 4, campo: 1, slot: 16 },
  { squadra1: 11, squadra2: 2, arbitro: 7, campo: 3, slot: 16 },
  { squadra1: 12, squadra2: 1, arbitro: 8, campo: 5, slot: 16 },

  { squadra1: 6, squadra2: 5, arbitro: 9, campo: 1, slot: 17 },
  { squadra1: 7, squadra2: 4, arbitro: 11, campo: 3, slot: 17 },
  { squadra1: 8, squadra2: 3, arbitro: 12, campo: 5, slot: 17 },

  { squadra1: 9, squadra2: 2, arbitro: 3, campo: 1, slot: 18 },
  { squadra1: 10, squadra2: 1, arbitro: 4, campo: 3, slot: 18 },
  { squadra1: 11, squadra2: 13, arbitro: 5, campo: 5, slot: 18 },

  { squadra1: 5, squadra2: 4, arbitro: 13, campo: 1, slot: 19 },
  { squadra1: 6, squadra2: 3, arbitro: 1, campo: 3, slot: 19 },
  { squadra1: 7, squadra2: 2, arbitro: 8, campo: 5, slot: 19 },

  { squadra1: 8, squadra2: 1, arbitro: 2, campo: 1, slot: 20 },
  { squadra1: 9, squadra2: 13, arbitro: 6, campo: 3, slot: 20 },
  { squadra1: 10, squadra2: 12, arbitro: 7, campo: 5, slot: 20 },

  { squadra1: 4, squadra2: 3, arbitro: 9, campo: 1, slot: 21 },
  { squadra1: 5, squadra2: 2, arbitro: 10, campo: 3, slot: 21 },
  { squadra1: 6, squadra2: 1, arbitro: 11, campo: 5, slot: 21 },

  { squadra1: 7, squadra2: 13, arbitro: 1, campo: 1, slot: 22 },
  { squadra1: 8, squadra2: 12, arbitro: 2, campo: 3, slot: 22 },
  { squadra1: 9, squadra2: 11, arbitro: 3, campo: 5, slot: 22 },

  { squadra1: 3, squadra2: 2, arbitro: 12, campo: 1, slot: 23 },
  { squadra1: 4, squadra2: 1, arbitro: 6, campo: 3, slot: 23 },
  { squadra1: 5, squadra2: 13, arbitro: 7, campo: 5, slot: 23 },

  { squadra1: 6, squadra2: 12, arbitro: 13, campo: 1, slot: 24 },
  { squadra1: 7, squadra2: 11, arbitro: 4, campo: 3, slot: 24 },
  { squadra1: 8, squadra2: 10, arbitro: 5, campo: 5, slot: 24 },

  { squadra1: 2, squadra2: 1, arbitro: 9, campo: 1, slot: 25 },
  { squadra1: 3, squadra2: 13, arbitro: 10, campo: 3, slot: 25 },
  { squadra1: 4, squadra2: 12, arbitro: 11, campo: 5, slot: 25 },

  { squadra1: 5, squadra2: 11, arbitro: 8, campo: 1, slot: 26 },
  { squadra1: 6, squadra2: 10, arbitro: 12, campo: 3, slot: 26 },
  { squadra1: 7, squadra2: 9, arbitro: 13, campo: 5, slot: 26 },
];

async function main() {
  const baserow = new BaseRow(process.env.BASEROW_TOKEN);
  const gironi = Object.keys(SCHEMA_GIRONI);
  const partite = await getRows("MISTO", "Gironi", gironi);
  const squadre = await getRows("MISTO", "Squadre");
  const nomi_squadre = squadre.map((v) => v.Nome);

  for (const girone of gironi) {
    console.log(`Girone ${girone}`);
    // Controllo che le squadre esistano
    console.log("Caricamento squadre");
    const squadre_girone = SCHEMA_GIRONI[girone].squadre;
    for (const sq of squadre_girone) {
      if (!nomi_squadre.includes(sq)) {
        await baserow.create_row("MISTO", "Squadre", {
          Nome: sq,
        });
      }
    }
    // Confronto la partita generata con le partite già presenti
    console.log("Caricamento partite");
    for (const partite_schema of SCHEMA_PARTITE_13) {
      let orario = new Date(START_TIME.getTime() + (partite_schema.slot - 1) * MINUTES * 60 * 1000);
      if (orario >= new Date(2026, 7, 15, 12, 0, 0)) {
        orario = new Date(orario.getTime() + 2 * 60 * 60 * 1000);
      }
      if (orario >= new Date(2026, 7, 15, 17, 0, 0)) {
        orario = new Date(orario.getTime() + 16 * 60 * 60 * 1000);
      }
      orario = orario.toISOString();
      const partita = {
        Girone: girone,
        "Squadra 1": squadre_girone[partite_schema.squadra1 - 1],
        "Squadra 2": squadre_girone[partite_schema.squadra2 - 1],
        Arbitro: squadre_girone[partite_schema.arbitro - 1],
        Campo: SCHEMA_GIRONI[girone].campo + partite_schema.campo - 1,
        Orario: orario.substring(0, 19) + "Z",
        Turno: partite_schema.slot,
      };
      const index = partite.findIndex(
        (v) =>
          v.Girone == partita.Girone &&
          v["Squadra 1"] == partita["Squadra 1"] &&
          v["Squadra 2"] == partita["Squadra 2"] &&
          v.Arbitro == partita.Arbitro &&
          v.Campo == partita.Campo &&
          v.Orario == partita.Orario &&
          v.Turno == partita.Turno,
      );
      // Nascondo la partita dalle partite esistenti
      if (index != -1) {
        partite.splice(index, 1);
        continue;
      }
      // Crea la partita che non è stata trovata
      await baserow.create_row("MISTO", "Gironi", partita).catch(async (v) => console.log(await v.cause.json()));
    }
  }
  // Elimino le partite che non sono state trovate nello schema
  console.log("Elimino partite non riconosciute");
  for (const partita of partite) {
    await baserow.delete_row("MISTO", "Gironi", partita.id);
  }
}

await main();

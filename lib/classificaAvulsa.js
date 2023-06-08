import { howManyPoints } from "./useClassifica";

function getNewObject(sq) {
  return {
    "Punti Fatti": 0,
    "Punti Subiti": 0,
    Punti: 0,
    "Partite Giocate": 0,
    "Quoziente Punti": 0,
    Nome: sq,
  };
}

export function calcClassificaAvulsa(records) {
  const squadre = {};

  for (const record of records) {
    const squadra1 = record["Squadra 1"][0];
    const squadra2 = record["Squadra 2"][0];
    const punti1 = record["Punti 1"] || 0;
    const punti2 = record["Punti 2"] || 0;
    if (!squadre[squadra1]) {
      squadre[squadra1] = getNewObject(squadra1);
    }
    if (!squadre[squadra2]) {
      squadre[squadra2] = getNewObject(squadra2);
    }
    squadre[squadra1]["Punti Fatti"] += punti1;
    squadre[squadra1]["Punti Subiti"] += punti2;
    squadre[squadra2]["Punti Fatti"] += punti2;
    squadre[squadra2]["Punti Subiti"] += punti1;
    const rowPoints = howManyPoints(record) || [0, 0];
    squadre[squadra1]["Punti"] += rowPoints[0];
    squadre[squadra2]["Punti"] += rowPoints[1];
    if (record["Status"] == "Terminata") {
      squadre[squadra1]["Partite Giocate"] += 1;
      squadre[squadra2]["Partite Giocate"] += 1;
    }
  }

  Object.keys(squadre).forEach((v) => {
    const partiteGiocate = squadre[v]["Partite Giocate"];
    if (partiteGiocate > 0) {
      squadre[v]["Quoziente Punti"] = squadre[v]["Punti"] / partiteGiocate;
    }
  });

  return Object.values(squadre).sort((a, b) => {
    if (a["Quoziente Punti"] < b["Quoziente Punti"]) return 1;
    return -1;
  });
}

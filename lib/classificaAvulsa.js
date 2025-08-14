import { EnumClassificaAvulsa } from "./enums.js";

function getNewObject(sq) {
  return {
    [EnumClassificaAvulsa.PuntiFatti]: 0,
    [EnumClassificaAvulsa.PuntiSubiti]: 0,
    [EnumClassificaAvulsa.Punteggio]: 0,
    [EnumClassificaAvulsa.PartiteGiocate]: 0,
    [EnumClassificaAvulsa.QuozientePunteggio]: 0,
    [EnumClassificaAvulsa.QuozientePunti]: 0,
    [EnumClassificaAvulsa.Vittorie]: 0,
    [EnumClassificaAvulsa.Nome]: sq,
  };
}

// Calcolo quanti punti assegnare alle squadre in base al punteggio della partita
export function howManyPoints(row) {
  const points1 = parseInt(row["Punti 1"]);
  const points2 = parseInt(row["Punti 2"]);
  if (isNaN(points1) || isNaN(points2)) return null;
  if (points2 < 19) return [3, 0];
  if (points1 < 19) return [0, 3];
  if (points1 > points2) return [2, 1];
  return [1, 2];
}

export function calcClassificaAvulsa(records) {
  const squadre = {};

  for (const record of records) {
    const squadra1 = record["Squadra 1"];
    const squadra2 = record["Squadra 2"];
    const punti1 = parseInt(record["Punti 1"]) || 0;
    const punti2 = parseInt(record["Punti 2"]) || 0;
    if (!squadre[squadra1]) {
      squadre[squadra1] = getNewObject(squadra1);
    }
    if (!squadre[squadra2]) {
      squadre[squadra2] = getNewObject(squadra2);
    }
    squadre[squadra1][EnumClassificaAvulsa.PuntiFatti] += punti1;
    squadre[squadra1][EnumClassificaAvulsa.PuntiSubiti] += punti2;
    squadre[squadra2][EnumClassificaAvulsa.PuntiFatti] += punti2;
    squadre[squadra2][EnumClassificaAvulsa.PuntiSubiti] += punti1;
    const rowPoints = howManyPoints(record) || [0, 0];
    squadre[squadra1][EnumClassificaAvulsa.Punteggio] += rowPoints[0];
    squadre[squadra2][EnumClassificaAvulsa.Punteggio] += rowPoints[1];
    if (rowPoints[0] > 0) {
      squadre[squadra1][EnumClassificaAvulsa.Vittorie] += 1;
    }
    if (rowPoints[1] > 0) {
      squadre[squadra2][EnumClassificaAvulsa.Vittorie] += 1;
    }
    if (record["Status"] == "Terminata") {
      squadre[squadra1][EnumClassificaAvulsa.PartiteGiocate] += 1;
      squadre[squadra2][EnumClassificaAvulsa.PartiteGiocate] += 1;
    }
  }

  Object.keys(squadre).forEach((v) => {
    const partiteGiocate = squadre[v][EnumClassificaAvulsa.PartiteGiocate];
    if (partiteGiocate > 0) {
      squadre[v][EnumClassificaAvulsa.QuozientePunteggio] = squadre[v][EnumClassificaAvulsa.Punteggio] / partiteGiocate;
    }
    squadre[v][EnumClassificaAvulsa.QuozientePunti] =
      squadre[v][EnumClassificaAvulsa.PuntiFatti] / squadre[v][EnumClassificaAvulsa.PuntiSubiti] || null;
  });

  return Object.values(squadre).sort((a, b) => {
    if (a[EnumClassificaAvulsa.Punteggio] != b[EnumClassificaAvulsa.Punteggio]) {
      return b[EnumClassificaAvulsa.Punteggio] - a[EnumClassificaAvulsa.Punteggio];
    }
    if (a[EnumClassificaAvulsa.Vittorie] != b[EnumClassificaAvulsa.Vittorie]) {
      return b[EnumClassificaAvulsa.Vittorie] - a[EnumClassificaAvulsa.Vittorie];
    }
    if (a[EnumClassificaAvulsa.QuozientePunti] != b[EnumClassificaAvulsa.QuozientePunti]) {
      return b[EnumClassificaAvulsa.QuozientePunti] - a[EnumClassificaAvulsa.QuozientePunti];
    }
    return 0;
  });
}

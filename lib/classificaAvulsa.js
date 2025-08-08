import { EnumClassificaAvulsa } from "./enums";
import { howManyPoints } from "./useClassifica";

function getNewObject(sq) {
  return {
    [EnumClassificaAvulsa.PuntiFatti]: 0,
    [EnumClassificaAvulsa.PuntiSubiti]: 0,
    [EnumClassificaAvulsa.Punti]: 0,
    [EnumClassificaAvulsa.PartiteGiocate]: 0,
    [EnumClassificaAvulsa.QuozientePunteggio]: 0,
    [EnumClassificaAvulsa.QuozientePunti]: 0,
    [EnumClassificaAvulsa.Nome]: sq,
  };
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
    squadre[squadra1][EnumClassificaAvulsa.Punti] += rowPoints[0];
    squadre[squadra2][EnumClassificaAvulsa.Punti] += rowPoints[1];
    if (record["Status"] == "Terminata") {
      squadre[squadra1][EnumClassificaAvulsa.PartiteGiocate] += 1;
      squadre[squadra2][EnumClassificaAvulsa.PartiteGiocate] += 1;
    }
  }

  Object.keys(squadre).forEach((v) => {
    const partiteGiocate = squadre[v][EnumClassificaAvulsa.PartiteGiocate];
    if (partiteGiocate > 0) {
      squadre[v][EnumClassificaAvulsa.QuozientePunteggio] = squadre[v][EnumClassificaAvulsa.Punti] / partiteGiocate;
    }
    squadre[v][EnumClassificaAvulsa.QuozientePunti] =
      squadre[v][EnumClassificaAvulsa.PuntiFatti] / squadre[v][EnumClassificaAvulsa.PuntiSubiti] || null;
  });

  return Object.values(squadre).sort((a, b) => {
    if (a[EnumClassificaAvulsa.QuozientePunteggio] != b[EnumClassificaAvulsa.QuozientePunteggio]) {
      return b[EnumClassificaAvulsa.QuozientePunteggio] - a[EnumClassificaAvulsa.QuozientePunteggio];
    }
    if (a[EnumClassificaAvulsa.QuozientePunti] != b[EnumClassificaAvulsa.QuozientePunti]) {
      return b[EnumClassificaAvulsa.QuozientePunti] - a[EnumClassificaAvulsa.QuozientePunti];
    }
    return 0;
  });
}

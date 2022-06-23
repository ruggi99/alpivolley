export const EnumData = [
  "Squadra_1",
  "Squadra_2",
  "Arbitro",
  "Orario",
  "Campo",
  "Punteggio_1",
  "Punteggio_2",
  "Punti_1",
  "Punti_2",
];
export const EnumNomi = ["Nome"];
export const EnumClassifica = [
  "Nome",
  "Girone",
  "Punti",
  "Vittorie",
  "Vittorie_3_0",
];

export const EnumDataRev = {};
EnumData.forEach((v, i) => (EnumDataRev[v] = i));

export const EnumNomiRev = {};
EnumNomi.forEach((v, i) => (EnumNomiRev[v] = i));

export const EnumClassificaRev = {};
EnumClassifica.forEach((v, i) => (EnumClassificaRev[v] = i));

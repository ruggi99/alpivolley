export const EnumData = [
  "Squadra_1",
  "Squadra_2",
  "Arbitro",
  "Orario",
  "Campo",
  "Punteggio$1",
  "Punteggio$2",
];
export const EnumNomi = ["Nome"];
export const EnumClassifica = [
  "Nome",
  "Girone",
  "Punti",
  "Vittorie",
  "Vittorie$3_0",
];

export const EnumDataRev = {};
EnumData.forEach((v, i) => (EnumDataRev[v] = i));

export const EnumNomiRev = {};
EnumNomi.forEach((v, i) => (EnumNomiRev[v] = i));

export const EnumClassificaRev = {};
EnumClassifica.forEach((v, i) => (EnumClassificaRev[v] = i));

export function transformEnum(str) {
  return str.replaceAll("$", " ").replaceAll("_", "-");
}

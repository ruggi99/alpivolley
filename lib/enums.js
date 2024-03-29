export const EnumNomi = ["Nome"];
export const EnumClassifica = [
  "Nome",
  "Girone",
  "Punti",
  "Vittorie",
  "Vittorie$3_0",
];
export const EnumClassificaAvulsa = {
  PuntiFatti: "Punti Fatti",
  PuntiSubiti: "Punti Subiti",
  Punti: "Punti",
  PartiteGiocate: "Partite Giocate",
  QuozientePunteggio: "Quoziente Punteggio",
  Nome: "Nome",
  QuozientePunti: "Quoziente Punti",
};

export const EnumNomiRev = {};
EnumNomi.forEach((v, i) => (EnumNomiRev[v] = i));

export const EnumClassificaRev = {};
EnumClassifica.forEach((v, i) => (EnumClassificaRev[v] = i));

export function transformEnum(str) {
  return str.replaceAll("$", " ").replaceAll("_", "-");
}

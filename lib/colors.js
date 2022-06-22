import { EnumNomiRev, EnumDataRev } from "lib/enums";

const colors = [
  "bg-squadre-1",
  "bg-squadre-2",
  "bg-squadre-3",
  "bg-squadre-4",
  "bg-squadre-5",
  "bg-squadre-6",
  "bg-squadre-7",
  "bg-squadre-8",
];

export function getSqColor(i, name, nomi) {
  if (
    i != EnumDataRev.Squadra_1 &&
    i != EnumDataRev.Squadra_2 &&
    i != EnumDataRev.Arbitro
  ) {
    return undefined;
  }
  const index = nomi.findIndex((_, i) => name == nomi[i][EnumNomiRev.Nome]);
  if (index > -1) {
    return colors[index];
  }
}

export function getPuntiColor(i, rowPoints) {
  switch (i) {
    case EnumDataRev.Punteggio_1:
      return rowPoints && (rowPoints[0] > 1 ? "bg-green-200" : "bg-red-200");
    case EnumDataRev.Punteggio_2:
      return rowPoints && (rowPoints[1] > 1 ? "bg-green-200" : "bg-red-200");
    case EnumDataRev.Punti_1:
      return rowPoints && (rowPoints[0] > 1 ? "bg-green-200" : "bg-red-200");
    case EnumDataRev.Punti_2:
      return rowPoints && (rowPoints[1] > 1 ? "bg-green-200" : "bg-red-200");
  }
}

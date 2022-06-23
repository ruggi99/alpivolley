import { EnumDataRev, EnumNomiRev } from "lib/enums";

const bgColors = [
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
    return bgColors[index];
  }
}

function getPuntiColorRaw(rowPoints) {
  switch (rowPoints) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-red-600";
    case 2:
      return "text-green-600";
    case 3:
      return "text-green-600";
  }
}

export function getPuntiColor(i, rowPoints) {
  switch (i) {
    case EnumDataRev.Punteggio_1:
      return rowPoints && getPuntiColorRaw(rowPoints[0]);
    case EnumDataRev.Punteggio_2:
      return rowPoints && getPuntiColorRaw(rowPoints[1]);
    case EnumDataRev.Punti_1:
      return rowPoints && getPuntiColorRaw(rowPoints[0]);
    case EnumDataRev.Punti_2:
      return rowPoints && getPuntiColorRaw(rowPoints[1]);
  }
}

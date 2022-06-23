import { EnumNomiRev } from "lib/enums";

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

export function getSqColor(name, nomi) {
  const index = nomi.findIndex((v) => name == v[EnumNomiRev.Nome]);
  if (index > -1) {
    return bgColors[index];
  }
}

export function getPuntiColor(rowPoints) {
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

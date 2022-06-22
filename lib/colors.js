const colors = [
  "bg-squadre-1",
  "bg-squadre-2",
  "bg-squadre-3",
  "bg-squadre-4",
  "bg-squadre-5",
  "bg-gray-300",
  "bg-green-300",
  "bg-orange-300",
];

export function getColor(sq, nomi) {
  const index = nomi.findIndex((_, i) => sq == nomi[i][1]);
  if (index > -1) {
    return colors[index];
  }
}

const colors = [
  "bg-red-300",
  "bg-yellow-300",
  "bg-blue-300",
  "bg-teal-300",
  "bg-purple-300",
  "bg-gray-300",
  "bg-green-300",
  "bg-orange-300",
];

export function getColor(sq, nomi, rowIndex) {
  const index = nomi.findIndex((v, i) => sq == nomi[i][1]);
  if (index > -1) {
    return colors[index];
  } else if (rowIndex != undefined) {
    return rowIndex % 2 == 1 ? "bg-blue-100" : "";
  }
}

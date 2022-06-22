const colors = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-blue-200",
  "bg-purple-500",
  "bg-gray-500",
  "bg-green-500",
  "bg-green-200",
];

export function getColor(sq, nomi, rowIndex) {
  const index = nomi.findIndex((v, i) => sq == nomi[i][1]);
  if (index > -1) {
    return colors[index];
  } else if (rowIndex != undefined) {
    return rowIndex % 2 == 1 ? "bg-blue-100" : "";
  }
}

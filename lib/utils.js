export function firstLetterUp(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export function getNomifromData(data) {
  const nomi = new Set();
  for (const row of data) {
    nomi.add(row["Squadra 1"]).add(row["Squadra 2"]).add(row["Arbitro"]);
  }
  return Array.from(nomi);
}

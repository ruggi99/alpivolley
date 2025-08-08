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

export function whoIsWinner(row) {
  const punti1 = row["Punti 1"];
  const punti2 = row["Punti 2"];
  const diff = Math.abs(punti1 - punti2);
  if (punti1 == 23 || (punti1 > punti2 && diff > 1)) {
    return 1;
  }
  if (punti2 == 23 || (punti2 > punti1 && diff > 1)) {
    return 2;
  }
  return 0;
}

export function calculateMaxFase(data) {
  return Object.keys(Object.groupBy(data, (v) => [v.Fase])).length - 1;
}

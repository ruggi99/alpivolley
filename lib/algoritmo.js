/**
 * 0 -> nothing
 * 1 -> finale
 * 2 -> semifinale
 * 3 -> quarti
 * 4 -> ottavi
 * 5 -> sedicesimi
 */
export function algoritmo(numero) {
  if (numero <= 0) return [];
  const array = [1, 2];
  for (let level = 2; level <= numero; level++) {
    const to_insert = 2 ** (level - 2);
    const middle = 2 ** (level - 1);
    const totale = 2 ** level + 1;
    for (let i = 0; i < to_insert; i++) {
      const index = i * 2;
      array.splice(index + 1, 0, totale - array[index]);
    }
    for (let i = 0; i < to_insert; i++) {
      const index = i * 2;
      array.splice(index + middle + 1, 0, totale - array[index + middle]);
    }
  }
  return array;
}

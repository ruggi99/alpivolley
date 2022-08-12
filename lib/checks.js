import { categorie, gironi } from "lib/const";

export function checkCategoria(cat) {
  return categorie.includes(cat);
}

export function checkGirone(cat, gir) {
  if (!checkCategoria(cat)) return false;
  const nGironi = gironi[cat];
  const girCode = gir.charCodeAt(0);
  return 65 <= girCode && girCode < 65 + nGironi;
}

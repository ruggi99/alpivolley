export const DATA = {
  MISTO: {
    gironi: 15,
    campo: 1,
  },
};
export const CATEGORIE = Object.keys(DATA);

export const GIRONI = {
  A: "Anguria",
  B: "Banana",
  C: "Ciliegia",
  D: "Dattero",
  E: "Eucalipto",
  F: "Fragola",
  G: "Ginepro",
  L: "Limone",
  M: "Mela",
  N: "Noce",
  O: "Oliva",
  P: "Papaya",
  R: "Ribes",
  S: "Sambuco",
  U: "Uva",
  Z: "Zucca",
};

export const GIRONI_LETTERS = Object.keys(GIRONI);

export const GIRONI_VALUES = Object.values(GIRONI);

export const GIRONI_PATHS = CATEGORIE.map((c) =>
  Array(GIRONI_LETTERS.length)
    .fill(0)
    .map((_, i) => `/${c}/${GIRONI_LETTERS[i]}`),
).flat(2);

export const REVALIDATE = 60;

export const LOCALSTORAGEKEY = "alpivolley_consent";

export const FASI = ["Finalissima", "Finali", "Semifinali", "Quarti", "Ottavi", "Sedicesimi", "Trentaduesimi"];

export const FASI2 = ["Diretta", "Ripescaggio 1", "Ripescaggio 2"];

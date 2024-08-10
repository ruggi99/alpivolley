export const DATA = {
  U13M: {
    gironi: 16,
    campo: 11,
  },
  U15M: {
    gironi: 16,
    campo: 21,
  },
  U17M: {
    gironi: 16,
    campo: 31,
  },
  U13F: {
    gironi: 16,
    campo: 11,
  },
  U14F: {
    gironi: 16,
    campo: 21,
  },
  U16F: {
    gironi: 16,
    campo: 31,
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
  Array(DATA[c].gironi)
    .fill(0)
    .map((_, i) => `/${c}/${GIRONI_LETTERS[i]}`),
).flat(2);

export const REVALIDATE = 60;

export const LOCALSTORAGEKEY = "alpivolley_consent";

export function getNomifromData(data) {
  const nomi = new Set();
  for (const row of data) {
    nomi.add([row["Squadra 1"]]).add([row["Squadra 2"]]).add([row["Arbitro"]]);
  }
  return Array.from(nomi);
}

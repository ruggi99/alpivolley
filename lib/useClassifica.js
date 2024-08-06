import { useMemo } from "react";

import { EnumClassifica, EnumClassificaRev } from "lib/enums";

// Calcolo classifica singolo girone
// data = array di partite
export function useClassifica(data) {
  return useMemo(() => calcSingolaClassifica(data, 0), [data]);
}

// Calcolo quanti punti assegnare alle squadre in base al punteggio della partita
export function howManyPoints(row) {
  const points1 = parseInt(row["Punti 1"]);
  const points2 = parseInt(row["Punti 2"]);
  if (isNaN(points1) || isNaN(points2)) return null;
  if (points2 < 19) return [3, 0];
  if (points1 < 19) return [0, 3];
  if (points1 > points2) return [2, 1];
  return [1, 2];
}

// Calcolo classifica singolo girone
// i indica il girone
function calcSingolaClassifica(data, i) {
  const classifica = [];
  // Per ogni partita calcolo i punti da assegnare e chi ha vinto
  for (const row of data) {
    const squadra1 = row["Squadra 1"];
    const squadra2 = row["Squadra 2"];
    if (!squadra1 || !squadra2) continue;
    var index1 = classifica.findIndex((v) => v[0] == squadra1);
    var index2 = classifica.findIndex((v) => v[0] == squadra2);
    const points = howManyPoints(row) || [0, 0];
    if (index1 == -1) {
      inserisciRecordClassifica(classifica, squadra1, i);
      index1 = classifica.length - 1;
    }
    if (index2 == -1) {
      inserisciRecordClassifica(classifica, squadra2, i);
      index2 = classifica.length - 1;
    }

    classifica[index1][EnumClassificaRev.Punti] += points[0];
    classifica[index1][EnumClassificaRev.Vittorie] += points[0] > 1 ? 1 : 0;
    classifica[index1][EnumClassificaRev.Vittorie$3_0] += points[0] > 2 ? 1 : 0;
    classifica[index2][EnumClassificaRev.Punti] += points[1];
    classifica[index2][EnumClassificaRev.Vittorie] += points[1] > 1 ? 1 : 0;
    classifica[index2][EnumClassificaRev.Vittorie$3_0] += points[1] > 2 ? 1 : 0;
  }
  return classifica.sort(sortClassifica);
}

function sortClassifica(a, b) {
  // ordino per punti fatti
  if (a[EnumClassificaRev.Punti] != b[EnumClassificaRev.Punti])
    return b[EnumClassificaRev.Punti] - a[EnumClassificaRev.Punti];
  // ordino per vittorie
  if (a[EnumClassificaRev.Vittorie] != b[EnumClassificaRev.Vittorie])
    return b[EnumClassificaRev.Vittorie] - a[EnumClassificaRev.Vittorie];
  // ordino per vittorie
  if (a[EnumClassificaRev.Vittorie$3_0] != b[EnumClassificaRev.Vittorie$3_0])
    return (
      b[EnumClassificaRev.Vittorie$3_0] - a[EnumClassificaRev.Vittorie$3_0]
    );
  // TODO: aggiornare metodo calcolo classifica
  return 0;
}

// Inserisce un nuovo record in classifica
function inserisciRecordClassifica(cl, nome, i) {
  const row = [nome, String.fromCharCode(65 + i)].concat(
    Array(EnumClassifica.length - 2).fill(0),
  );
  cl.push(row);
}

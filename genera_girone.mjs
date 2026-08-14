function generaCalendario() {
  const NUM_SQUADRE = 13;
  const CAMPI = [1, 2, 4];

  const squadre = Array.from({ length: NUM_SQUADRE }, (_, i) => i + 1);

  // ============================================================
  // 1. GIRONE ALL'ITALIANA
  //
  // 13 squadre -> 13 giornate
  // Ogni giornata:
  //   - 6 partite
  //   - 1 squadra riposa
  //
  // Rotazione circolare corretta.
  // ============================================================

  const giornate = [];
  let rotazione = [...squadre];

  for (let giornata = 0; giornata < 13; giornata++) {
    const partite = [];

    // Le prime 6 contro le ultime 6
    // La squadra in posizione 6 riposa.
    for (let i = 0; i < 6; i++) {
      partite.push({
        squadra1: rotazione[i],
        squadra2: rotazione[12 - i],
      });
    }

    giornate.push(partite);

    // Rotazione di UNA posizione di tutta la lista
    rotazione = [rotazione[12], ...rotazione.slice(0, 12)];
  }

  // ============================================================
  // 2. VERIFICA GIRONE
  // ============================================================

  const partiteViste = new Set();

  for (const giornata of giornate) {
    for (const partita of giornata) {
      const a = Math.min(partita.squadra1, partita.squadra2);

      const b = Math.max(partita.squadra1, partita.squadra2);

      const chiave = `${a}-${b}`;

      if (partiteViste.has(chiave)) {
        throw new Error(`Partita duplicata durante la generazione: ${chiave}`);
      }

      partiteViste.add(chiave);
    }
  }

  if (partiteViste.size !== 78) {
    throw new Error(`Sono state generate ${partiteViste.size} partite invece di 78.`);
  }

  // ============================================================
  // 3. DIVISIONE DELLE 13 GIORNATE IN 26 SLOT
  //
  // Ogni giornata:
  //
  //   SLOT A -> 3 partite
  //   SLOT B -> 3 partite
  //
  // Quindi:
  // 13 × 2 = 26 slot
  // 26 × 3 = 78 partite
  // ============================================================

  const slot = [];

  giornate.forEach((partite, index) => {
    slot.push({
      numero: index * 2 + 1,
      partite: partite.slice(0, 3),
    });

    slot.push({
      numero: index * 2 + 2,
      partite: partite.slice(3, 6),
    });
  });

  // ============================================================
  // 4. SQUADRE DISPONIBILI COME ARBITRI
  //
  // In ogni slot:
  //   6 squadre giocano
  //   7 squadre riposano
  //
  // Gli arbitri devono essere scelti tra queste 7.
  // ============================================================

  const informazioniSlot = slot.map((s) => {
    const giocano = new Set();

    s.partite.forEach((p) => {
      giocano.add(p.squadra1);
      giocano.add(p.squadra2);
    });

    const disponibili = squadre.filter((squadra) => !giocano.has(squadra));

    return {
      numero: s.numero,
      partite: s.partite,
      giocano,
      disponibili,
    };
  });

  // ============================================================
  // 5. ASSEGNAZIONE ARBITRI
  //
  // 78 partite = 78 arbitraggi
  // 78 / 13 = 6
  //
  // Quindi OGNI squadra deve arbitrare esattamente 6 volte.
  // ============================================================

  const conteggioArbitri = Array(NUM_SQUADRE + 1).fill(0);

  const assegnazioni = Array(informazioniSlot.length);

  // Numero di slot rimanenti da elaborare
  const slotRimanenti = Array(informazioniSlot.length + 1).fill(0);

  // Per ogni squadra calcoliamo in quanti slot
  // può ancora arbitrare.
  function contaPossibilitaDa(index, squadra) {
    let count = 0;

    for (let i = index; i < informazioniSlot.length; i++) {
      if (informazioniSlot[i].disponibili.includes(squadra)) {
        count++;
      }
    }

    return count;
  }

  function ricerca(index) {
    // Tutti gli slot assegnati
    if (index === informazioniSlot.length) {
      return conteggioArbitri.slice(1).every((n) => n === 6);
    }

    const info = informazioniSlot[index];

    // ========================================================
    // CONTROLLO DI FATTIBILITÀ
    // ========================================================

    for (let squadra = 1; squadra <= NUM_SQUADRE; squadra++) {
      const necessari = 6 - conteggioArbitri[squadra];

      if (necessari < 0) {
        return false;
      }

      const possibili = contaPossibilitaDa(index, squadra);

      if (possibili < necessari) {
        return false;
      }
    }

    // ========================================================
    // CREIAMO LE COMBINAZIONI DI 3 ARBITRI
    // ========================================================

    const disponibili = info.disponibili
      .filter((s) => conteggioArbitri[s] < 6)
      .sort((a, b) => {
        // Prima le squadre che hanno più bisogno
        const bisognoA = 6 - conteggioArbitri[a];

        const bisognoB = 6 - conteggioArbitri[b];

        return bisognoB - bisognoA;
      });

    for (let a = 0; a < disponibili.length; a++) {
      for (let b = a + 1; b < disponibili.length; b++) {
        for (let c = b + 1; c < disponibili.length; c++) {
          const arbitri = [disponibili[a], disponibili[b], disponibili[c]];

          // Assegna
          arbitri.forEach((squadra) => {
            conteggioArbitri[squadra]++;
          });

          let valido = true;

          // Nessuno può superare 6
          for (let squadra = 1; squadra <= NUM_SQUADRE; squadra++) {
            if (conteggioArbitri[squadra] > 6) {
              valido = false;
              break;
            }
          }

          // Controllo possibilità futura
          if (valido) {
            for (let squadra = 1; squadra <= NUM_SQUADRE; squadra++) {
              const necessari = 6 - conteggioArbitri[squadra];

              const possibili = contaPossibilitaDa(index + 1, squadra);

              if (possibili < necessari) {
                valido = false;
                break;
              }
            }
          }

          if (valido) {
            assegnazioni[index] = arbitri;

            if (ricerca(index + 1)) {
              return true;
            }
          }

          // Backtracking
          arbitri.forEach((squadra) => {
            conteggioArbitri[squadra]--;
          });
        }
      }
    }

    return false;
  }

  if (!ricerca(0)) {
    throw new Error("Impossibile trovare una distribuzione con 6 arbitraggi esatti per ogni squadra.");
  }

  // ============================================================
  // 6. COSTRUZIONE ARRAY FINALE
  // ============================================================

  const calendario = [];

  informazioniSlot.forEach((info, index) => {
    const arbitri = assegnazioni[index];

    info.partite.forEach((partita, partitaIndex) => {
      calendario.push({
        squadra1: partita.squadra1,
        squadra2: partita.squadra2,
        arbitro: arbitri[partitaIndex],
        campo: CAMPI[partitaIndex],
        slot: info.numero,
      });
    });
  });

  // ============================================================
  // 7. VERIFICHE FINALI
  // ============================================================

  // 78 partite
  if (calendario.length !== 78) {
    throw new Error(`Partite generate: ${calendario.length}, attese: 78`);
  }

  // Nessuna partita duplicata
  const verificaPartite = new Set();

  calendario.forEach((p) => {
    const a = Math.min(p.squadra1, p.squadra2);

    const b = Math.max(p.squadra1, p.squadra2);

    const chiave = `${a}-${b}`;

    if (verificaPartite.has(chiave)) {
      throw new Error(`Partita duplicata: ${chiave}`);
    }

    verificaPartite.add(chiave);
  });

  // Ogni squadra deve giocare 12 volte
  const partitePerSquadra = Array(NUM_SQUADRE + 1).fill(0);

  calendario.forEach((p) => {
    partitePerSquadra[p.squadra1]++;
    partitePerSquadra[p.squadra2]++;
  });

  for (let squadra = 1; squadra <= NUM_SQUADRE; squadra++) {
    if (partitePerSquadra[squadra] !== 12) {
      throw new Error(`La squadra ${squadra} gioca ` + `${partitePerSquadra[squadra]} partite invece di 12.`);
    }
  }

  // Ogni squadra arbitra esattamente 6 volte
  const arbitraggiFinali = Array(NUM_SQUADRE + 1).fill(0);

  calendario.forEach((p) => {
    arbitraggiFinali[p.arbitro]++;
  });

  for (let squadra = 1; squadra <= NUM_SQUADRE; squadra++) {
    if (arbitraggiFinali[squadra] !== 6) {
      throw new Error(`La squadra ${squadra} arbitra ` + `${arbitraggiFinali[squadra]} volte invece di 6.`);
    }
  }

  // L'arbitro non deve giocare nello stesso slot
  calendario.forEach((p) => {
    if (p.arbitro === p.squadra1 || p.arbitro === p.squadra2) {
      throw new Error(`La squadra ${p.arbitro} è contemporaneamente ` + `giocatore e arbitro nello slot ${p.slot}.`);
    }
  });

  return calendario;
}

const calendario = generaCalendario();

console.table(calendario);
console.log(calendario);

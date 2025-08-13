import { Position } from "@xyflow/react";

import { algoritmo } from "lib/algoritmo";
import { whoIsWinner } from "lib/utils";
import { calculateMaxFase } from "lib/utils";

import { FASI, FASI2 } from "./const";
import {
  calculateEdges as calculateEdges1,
  calculateFakeData as calculateFakeData1,
  calculateHeaders as calculateHeaders1,
  calculateNodes as calculateNodes1,
  calculateNodesOld as calculateNodesOld1,
} from "./eliminazione";

export function calculateFakeData(NUMERO_FASI) {
  if (NUMERO_FASI <= 1) return [];
  const data = calculateFakeData1(NUMERO_FASI);
  for (let fase = 0; fase <= NUMERO_FASI; fase++) {
    // La fase diretta non ha Finalissima
    if (fase == 0) {
      const _nodi_diretta = algoritmo(Math.max(fase, 1));
      const nodi_diretta = [];
      for (let i = 0; i < _nodi_diretta.length / 2; i++) {
        nodi_diretta.push({
          id: FASI[fase].toLowerCase() + "-" + i.toString(),
          squadra1: _nodi_diretta[i * 2],
          squadra2: _nodi_diretta[i * 2 + 1],
        });
      }
      data[fase]["diretta"] = nodi_diretta;
    }
    const nodi_ripescaggio1 = [];
    const nodi_ripescaggio2 = [];
    if (fase > 0 && fase < NUMERO_FASI) {
      const _nodi_ripescaggio = algoritmo(Math.max(fase + 1, 2));
      for (let i = 0; i < _nodi_ripescaggio.length / 4; i++) {
        nodi_ripescaggio1.push({
          id: FASI[fase].toLowerCase() + "-r1-" + i.toString(),
          squadra1: _nodi_ripescaggio[i * 4 + 3],
          squadra2: _nodi_ripescaggio[i * 4 + 1],
        });
      }
      for (let i = 0; i < _nodi_ripescaggio.length / 4; i++) {
        nodi_ripescaggio2.push({
          id: FASI[fase].toLowerCase() + "-r2-" + i.toString(),
          squadra1: _nodi_ripescaggio[i * 4 + 2],
          squadra2: _nodi_ripescaggio[i * 4 + 3],
        });
      }
    }
    data[fase]["ripescaggio1"] = nodi_ripescaggio1;
    data[fase]["ripescaggio2"] = nodi_ripescaggio2;
  }
  return data;
}

export function calculateHeaders(max_fasi) {
  const nodeHeaders = [];
  nodeHeaders.push(...calculateHeaders1(max_fasi));
  for (let fase = 1; fase < max_fasi; fase++) {
    for (let fase2 = 1; fase2 <= 2; fase2++) {
      // Header
      nodeHeaders.push({
        data: {
          type: "header",
          fase: FASI[fase] + " R" + (3 - fase2),
        },
        style: {
          gridColumnStart: max_fasi - 1 + fase * 2 + fase2,
          gridRowStart: 1,
          gridRowEnd: 2,
        },
      });
    }
  }
  nodeHeaders.push({
    data: {
      type: "header",
      fase: FASI[0],
    },
    style: {
      gridColumnStart: max_fasi + 1,
      gridRowStart: 1,
      gridRowEnd: 2,
    },
  });
  return nodeHeaders;
}

export function calculateNodesOld(data, max_fasi) {
  const nodes = calculateNodesOld1(data, max_fasi);
  // Fase diretta
  const NUMERO_FASI = Math.min(data.length, max_fasi);
  for (let fase = 0; fase < NUMERO_FASI; fase++) {
    // La fase diretta non ha Finalissima
    if (fase == 0) {
      const nodi = data[fase].diretta;
      // Principal nodes
      nodes.push(
        ...nodi.map((v, i) => ({
          id: v.id,
          data: {
            type: "normal",
            squadra1: v.squadra1,
            squadra2: v.squadra2,
          },
          style: {
            gridColumnStart: NUMERO_FASI - fase,
            gridRowStart: i * 2 ** (NUMERO_FASI - Math.max(fase, 1) - 1) + 2,
            gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 1),
          },
          winner: 1,
        })),
      );
    }
    if (fase < 2 && NUMERO_FASI > 2) {
      // Ripescaggio 1 e 2 (sotto la finale) non ha posizionamento standard
      nodes.push({
        id: FASI[fase].toLowerCase() + "-rd-0",
        data: {
          type: "ripescaggio",
          number: fase + 1,
        },
        style: {
          gridColumnStart: NUMERO_FASI - fase,
          gridRowStart: 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2),
        },
      });
    }
    if (fase > 1 && NUMERO_FASI > 3 && fase < NUMERO_FASI - 1) {
      // Ripescaggio N > 2
      Array(2 ** (fase - 2))
        .fill(0)
        .forEach((_, i) => {
          nodes.push({
            id: FASI[fase].toLowerCase() + "-rd-" + i.toString(),
            data: {
              type: "ripescaggio",
              number: fase + 1,
            },
            style: {
              gridColumnStart: NUMERO_FASI - fase,
              gridRowStart: i * 2 ** (NUMERO_FASI - fase) + 2,
              gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase),
            },
          });
        });
    }
  }

  const START = NUMERO_FASI - 2;

  // Fase ripescaggio
  for (let fase = 1; fase < NUMERO_FASI - 1; fase++) {
    for (let fase2 = 1; fase2 <= 2; fase2++) {
      const nodi = data[fase]["ripescaggio" + fase2];
      nodes.push(
        ...nodi.map((v, i) => ({
          id: v.id,
          data: {
            type: "normal",
            squadra1: v.squadra1,
            squadra2: v.squadra2,
          },
          style: {
            gridColumnStart: START + fase * 2 + fase2,
            gridRowStart: i * 2 ** (NUMERO_FASI - fase - 1) + 2,
            gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase - 1),
          },
          winner: 1,
        })),
      );
      if (fase == 0) continue;
      if (fase2 == 2) {
        if (fase < 2 && NUMERO_FASI > 2) {
          // Ripescaggio 1 (sotto la finale) non ha posizionamento standard
          nodes.push({
            id: FASI[fase].toLowerCase() + "-rr2-0",
            data: {
              type: "ripescaggio",
              number: fase,
            },
            style: {
              gridColumnStart: START + fase * 2 + fase2,
              gridRowStart: 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2) + 2,
              gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2),
            },
          });
        } else {
          Array(fase < NUMERO_FASI - 1 ? Math.max(2 ** (fase - 3), 1) : 0)
            .fill(0)
            .forEach((_, i) => {
              nodes.push({
                id: FASI[fase].toLowerCase() + "-rr2-" + i.toString(),
                data: {
                  type: "ripescaggio",
                  number: fase,
                },
                style: {
                  gridColumnStart: START + fase * 2 + fase2,
                  gridRowStart: i * 2 ** (NUMERO_FASI - fase + 1) + 2,
                  gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase + (fase > 2 ? 1 : 0)),
                },
              });
            });
        }
      }
    }
  }

  // Ripescaggio ultima riga
  if (NUMERO_FASI > 1) {
    Array(Math.max(2 ** (NUMERO_FASI - 4), 1))
      .fill(0)
      .forEach((_, i) => {
        nodes.push({
          id: FASI[NUMERO_FASI - 1].toLowerCase() + "-rr2-" + i.toString(),
          data: {
            type: "ripescaggio",
            number: NUMERO_FASI - 1,
          },
          style: {
            gridColumnStart: START + (NUMERO_FASI - 1) * 2 + 1,
            gridRowStart: i * 4 + 2,
            gridRowEnd: "span " + 4,
          },
        });
      });
  }
  return nodes;
}

export function calculateNodes(data, max_fasi) {
  const nodes = [];
  // Fase diretta
  const NUMERO_FASI = Math.min(calculateMaxFase(data), max_fasi) + 1;
  console.log(NUMERO_FASI);
  const START = NUMERO_FASI - 2;
  for (const oldNode of data) {
    const i = parseInt(oldNode.Ordine) - 1;
    const fase = FASI.indexOf(oldNode.Fase);
    const fase2 = FASI2.indexOf(oldNode["Fase 2"]);
    if (fase2 == 0) {
      nodes.push({
        id: oldNode.Fase.toLowerCase() + "-" + i,
        data: {
          type: "normal",
          squadra1: oldNode["Squadra 1"],
          squadra2: oldNode["Squadra 2"],
          punti1: oldNode["Punti 1"],
          punti2: oldNode["Punti 2"],
          campo: oldNode["Campo"],
        },
        style: {
          gridColumnStart: NUMERO_FASI - fase,
          gridRowStart: i * 2 ** (NUMERO_FASI - Math.max(fase, 1) - 1) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 1),
        },
        winner: whoIsWinner(oldNode),
      });
    } else {
      nodes.push({
        id: oldNode.Fase.toLowerCase() + "-r" + fase2 + "-" + i,
        data: {
          type: "normal",
          squadra1: oldNode["Squadra 1"],
          squadra2: oldNode["Squadra 2"],
          punti1: oldNode["Punti 1"],
          punti2: oldNode["Punti 2"],
          campo: oldNode["Campo"],
        },
        style: {
          gridColumnStart: START + fase * 2 + (3 - fase2),
          gridRowStart: i * 2 ** (NUMERO_FASI - fase - 1) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase - 1),
        },
        winner: whoIsWinner(oldNode),
      });
    }
  }

  for (let fase = 0; fase < NUMERO_FASI; fase++) {
    if (fase < 2 && NUMERO_FASI > 2) {
      // Ripescaggio 1 e 2 (sotto la finale) non ha posizionamento standard
      nodes.push({
        id: FASI[fase].toLowerCase() + "-rd-0",
        data: {
          type: "ripescaggio",
          number: fase + 1,
        },
        style: {
          gridColumnStart: NUMERO_FASI - fase,
          gridRowStart: 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2),
        },
      });
    }
    if (fase > 1 && NUMERO_FASI > 3 && fase < NUMERO_FASI - 1) {
      // Ripescaggio N > 2
      Array(2 ** (fase - 2))
        .fill(0)
        .forEach((_, i) => {
          nodes.push({
            id: FASI[fase].toLowerCase() + "-rd-" + i.toString(),
            data: {
              type: "ripescaggio",
              number: fase + 1,
            },
            style: {
              gridColumnStart: NUMERO_FASI - fase,
              gridRowStart: i * 2 ** (NUMERO_FASI - fase) + 2,
              gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase),
            },
          });
        });
    }
  }

  // Fase ripescaggio
  for (let fase = 1; fase < NUMERO_FASI - 1; fase++) {
    for (let fase2 = 1; fase2 <= 2; fase2++) {
      if (fase == 0) continue;
      if (fase2 == 2) {
        if (fase < 2 && NUMERO_FASI > 2) {
          // Ripescaggio 1 (sotto la finale) non ha posizionamento standard
          nodes.push({
            id: FASI[fase].toLowerCase() + "-rr2-0",
            data: {
              type: "ripescaggio",
              number: fase,
            },
            style: {
              gridColumnStart: START + fase * 2 + fase2,
              gridRowStart: 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2) + 2,
              gridRowEnd: "span " + 2 ** (NUMERO_FASI - Math.max(fase, 1) - 2),
            },
          });
        } else {
          Array(fase < NUMERO_FASI - 1 ? Math.max(2 ** (fase - 3), 1) : 0)
            .fill(0)
            .forEach((_, i) => {
              nodes.push({
                id: FASI[fase].toLowerCase() + "-rr2-" + i.toString(),
                data: {
                  type: "ripescaggio",
                  number: fase,
                },
                style: {
                  gridColumnStart: START + fase * 2 + fase2,
                  gridRowStart: i * 2 ** (NUMERO_FASI - fase + 1) + 2,
                  gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase + (fase > 2 ? 1 : 0)),
                },
              });
            });
        }
      }
    }
  }

  // Ripescaggio ultima riga
  if (NUMERO_FASI > 1) {
    Array(Math.max(2 ** (NUMERO_FASI - 4), 1))
      .fill(0)
      .forEach((_, i) => {
        nodes.push({
          id: FASI[NUMERO_FASI - 1].toLowerCase() + "-rr2-" + i.toString(),
          data: {
            type: "ripescaggio",
            number: NUMERO_FASI - 1,
          },
          style: {
            gridColumnStart: START + (NUMERO_FASI - 1) * 2 + 1,
            gridRowStart: i * 4 + 2,
            gridRowEnd: "span " + 4,
          },
        });
      });
  }
  return nodes;
}

export function calculateEdges(NUMERO_FASI) {
  const edges = calculateEdges1(NUMERO_FASI);
  // Fase diretta
  for (let fase = 1; fase < NUMERO_FASI; fase++) {
    if (fase == 1) {
      Array(2 ** (fase - 1))
        .fill(0)
        .forEach((_, i) => {
          const source = FASI[fase].toLowerCase() + "-" + i.toString();
          const target = FASI[fase - 1].toLowerCase() + "-" + parseInt(i / 2);
          edges.push({
            id: source + "__" + target,
            source,
            target,
            sourceHandle: i % 4 < 2 ? "top" : "bottom",
            targetHandle: fase == 1 ? "middle" : i % 2 ? "bottom" : "top",
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            className: "green",
          });
        });
    }
    // Nella fase diretta mancano i ripescaggi
    Array(2 ** (fase - 1))
      .fill(0)
      .forEach((_, i) => {
        const source = FASI[fase].toLowerCase() + "-" + i.toString();
        const target = FASI[fase - 1].toLowerCase() + "-rd-" + parseInt(i / 4);
        edges.push({
          id: source + "__" + target,
          source,
          target,
          sourceHandle: i % 4 < 2 ? "bottom" : "top",
          targetHandle: fase == 1 ? "middle" : (fase == 2 ? i % 2 < 1 : i % 4 < 2) ? "top" : "bottom",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          className: "red",
        });
      });
  }

  // Fase ripescaggio
  for (let fase = 1; fase < NUMERO_FASI - 1; fase++) {
    for (let fase2 = 1; fase2 <= 2; fase2++) {
      // Fase 2 è sulla sinistra e Fase 1 sulla destra
      Array(2 ** (fase - 1))
        .fill(0)
        .forEach((_, i) => {
          let source, target;
          if (fase2 == 1) {
            source = FASI[fase].toLowerCase() + "-r2-" + i.toString();
            target = FASI[fase - 1].toLowerCase() + (fase == 1 ? "" : "-r1") + "-" + parseInt(i / 2);
          } else {
            source = FASI[fase].toLowerCase() + "-r1-" + i.toString();
            target = FASI[fase].toLowerCase() + "-r2-" + i.toString();
          }
          edges.push({
            id: source + "__" + target,
            source,
            target,
            sourceHandle: "middle",
            targetHandle:
              fase == 1 && fase2 == 1 ? "middle" : (fase2 == 1 || fase == 2 ? i % 2 < 1 : i % 4 < 2) ? "top" : "bottom",
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            className: "green",
          });
        });
      if (fase2 == 2) {
        // Dai nodi ripescaggio
        Array(2 ** (fase - 1))
          .fill(0)
          .forEach((_, i) => {
            const source = FASI[fase].toLowerCase() + "-rr2-" + parseInt(i / 4);
            const target = FASI[fase].toLowerCase() + "-r2-" + i.toString();
            edges.push({
              id: source + "__" + target,
              source,
              target,
              sourceHandle: fase == 1 ? "middle" : (fase == 2 ? i % 2 < 1 : i % 4 < 2) ? "top" : "bottom",
              targetHandle: (fase == 2 ? i % 2 < 1 : i % 4 < 2) ? "bottom" : "top",
              sourcePosition: Position.Left,
              targetPosition: Position.Right,
              className: "red",
            });
          });
      }
    }
  }

  // Ripescaggio ultima riga
  if (NUMERO_FASI > 1) {
    Array(2 ** (NUMERO_FASI - 2))
      .fill(0)
      .forEach((_, i) => {
        const source = FASI[NUMERO_FASI - 1].toLowerCase() + "-rr2" + "-" + parseInt(i / 4);
        const target = FASI[NUMERO_FASI - 2].toLowerCase() + "-r1" + "-" + parseInt(i / 2);
        edges.push({
          id: source + "__" + target,
          source,
          target,
          sourceHandle: i % 4 < 2 ? "top" : "bottom",
          targetHandle: i % 2 < 1 ? "top" : "bottom",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          className: "red",
        });
      });
  }
  return edges;
}

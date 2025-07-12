import { algoritmo } from "./algoritmo";
import { FASI } from "./const";

import { getBezierPath, Position } from "@xyflow/react";

export function calculateFakeData(NUMERO_FASI) {
  if (NUMERO_FASI <= 1) return [];
  const data = [];
  for (let fase = 0; fase <= NUMERO_FASI; fase++) {
    const _nodi_diretta = algoritmo(Math.max(fase, 1));
    const nodi_diretta = [];
    for (let i = 0; i < _nodi_diretta.length / 2; i++) {
      nodi_diretta.push({
        id: FASI[fase].toLowerCase() + "-" + i.toString(),
        squadra1: _nodi_diretta[i * 2],
        squadra2: _nodi_diretta[i * 2 + 1],
      });
    }
    data.push({
      fase: FASI[fase].toLowerCase(),
      diretta: nodi_diretta,
    });
  }
  return data;
}

export function calculateNodes(data, max_fasi) {
  const nodes = [];
  // Fase diretta
  const NUMERO_FASI = Math.min(data.length, max_fasi);
  for (let fase = 0; fase < NUMERO_FASI; fase++) {
    // Header
    nodes.push({
      data: {
        type: "header",
        fase: FASI[fase],
      },
      style: {
        gridColumnStart: NUMERO_FASI - fase,
        gridRowStart: 1,
        gridRowEnd: 2,
      },
    });
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
  return nodes;
}

export function calculateEdges(NUMERO_FASI) {
  const edges = [];
  // Fase diretta
  for (let fase = 1; fase < NUMERO_FASI; fase++) {
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
          targetHandle:
            fase == 1
              ? "middle"
              : (fase == 2 ? i % 2 < 1 : i % 4 < 2)
                ? "top"
                : "bottom",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          className: "red",
        });
      });
  }

  // Fase ripescaggio
  for (let fase = 1; fase < NUMERO_FASI - 1; fase++) {
    for (let fase2 = 1; fase2 <= 2; fase2++) {
      // Fase 2 e sulla sinistra e Fase 1 sulla destra
      Array(2 ** (fase - 1))
        .fill(0)
        .forEach((_, i) => {
          let source, target;
          if (fase2 == 1) {
            source = FASI[fase].toLowerCase() + "-r2-" + i.toString();
            target =
              FASI[fase - 1].toLowerCase() +
              (fase == 1 ? "" : "-r1") +
              "-" +
              parseInt(i / 2);
          } else {
            source = FASI[fase].toLowerCase() + "-r1-" + i.toString();
            target = FASI[fase].toLowerCase() + "-r2-" + i;
          }
          edges.push({
            id: source + "__" + target,
            source,
            target,
            sourceHandle: "middle",
            targetHandle:
              fase == 1 && fase2 == 1
                ? "middle"
                : (fase2 == 1 || fase == 2 ? i % 2 < 1 : i % 4 < 2)
                  ? "top"
                  : "bottom",
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
              sourceHandle:
                fase == 1
                  ? "middle"
                  : (fase == 2 ? i % 2 < 1 : i % 4 < 2)
                    ? "top"
                    : "bottom",
              targetHandle: (fase == 2 ? i % 2 < 1 : i % 4 < 2)
                ? "bottom"
                : "top",
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
        const source =
          FASI[NUMERO_FASI - 1].toLowerCase() + "-rr2" + "-" + parseInt(i / 4);
        const target =
          FASI[NUMERO_FASI - 2].toLowerCase() + "-r1" + "-" + parseInt(i / 2);
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

function calculateCoords(viewportCoords, coords, position, handle) {
  let x = coords["x"] - viewportCoords["x"];
  if (position == Position.Right) x += coords["width"];
  let y = coords["y"] - viewportCoords["y"];
  switch (handle) {
    case "top":
      y += coords["height"] * 0.33;
      break;
    case "middle":
      y += coords["height"] / 2;
      break;
    case "bottom":
      y += coords["height"] * 0.66;
      break;
  }
  return [x, y];
}

export function calculateEdgeCoords(edges) {
  const paths = [];
  const viewportEl = document.getElementById("viewport");
  const viewportCoords = viewportEl.getBoundingClientRect();
  for (const edge of edges) {
    const source = viewportEl.querySelector("#" + edge.source);
    const target = viewportEl.querySelector("#" + edge.target);
    const sourceCoords = source.getBoundingClientRect();
    const targetCoords = target.getBoundingClientRect();
    const [sourceX, sourceY] = calculateCoords(
      viewportCoords,
      sourceCoords,
      edge.sourcePosition,
      edge.sourceHandle,
    );
    const [targetX, targetY] = calculateCoords(
      viewportCoords,
      targetCoords,
      edge.targetPosition,
      edge.targetHandle,
    );
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition: edge.sourcePosition,
      targetPosition: edge.targetPosition,
    });
    paths.push({
      path,
      style: edge.style,
      id: edge.id,
      className: edge.className,
    });
  }
  return paths;
}

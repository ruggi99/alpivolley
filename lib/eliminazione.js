import { getBezierPath, Position } from "@xyflow/react";

import { algoritmo } from "./algoritmo";
import { FASI } from "./const";
import { calculateMaxFase } from "./utils";

export function calculateFakeData(NUMERO_FASI) {
  if (NUMERO_FASI <= 1) return [];
  const data = [];
  for (let fase = 0; fase <= NUMERO_FASI; fase++) {
    const _nodi_diretta = algoritmo(fase);
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

export function calculateHeaders(max_fasi) {
  const nodeHeaders = Array(max_fasi)
    .fill(0)
    .map((_, i) => {
      const node = {
        data: {
          type: "header",
          fase: FASI[i + 1],
        },
        style: {
          gridColumnStart: max_fasi - i,
          gridRowStart: 1,
          gridRowEnd: 2,
        },
      };
      return node;
    });
  return nodeHeaders;
}

export function calculateNodesOld(data, max_fasi) {
  const nodes = [];
  // Fase diretta
  const NUMERO_FASI = Math.min(data.length, max_fasi);
  for (let fase = 1; fase < NUMERO_FASI; fase++) {
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

export function calculateNodes(data, max_fasi) {
  const nodes = [];
  // Fase diretta
  const NUMERO_FASI = Math.min(calculateMaxFase(data), max_fasi) + 1;
  console.log(NUMERO_FASI);
  for (const oldNode of data) {
    const i = parseInt(oldNode.Ordine) - 1;
    const fase = FASI.indexOf(oldNode.Fase);
    // Principal nodes
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
      winner: 1,
    });
  }
  return nodes;
}

export function calculateEdges(NUMERO_FASI) {
  const edges = [];
  // Fase diretta
  for (let fase = 2; fase < NUMERO_FASI; fase++) {
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
    // console.log(edge.source, edge.target);
    const sourceCoords = source.getBoundingClientRect();
    const targetCoords = target.getBoundingClientRect();
    const [sourceX, sourceY] = calculateCoords(viewportCoords, sourceCoords, edge.sourcePosition, edge.sourceHandle);
    const [targetX, targetY] = calculateCoords(viewportCoords, targetCoords, edge.targetPosition, edge.targetHandle);
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

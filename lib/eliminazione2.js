// @refresh reset
import { getBezierPath, Position } from "@xyflow/react";

import { algoritmo } from "lib/algoritmo";

export const nodes = [];
export const edges = [];

const FASI = ["Finali", "Semifinali", "Quarti", "Ottavi", "Sedicesimi"];

const NUMERO_FASI = 4;

// Fase diretta
for (let fase = 0; fase < NUMERO_FASI; fase++) {
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
  const nodi = algoritmo(fase + 1);
  Array(2 ** fase)
    .fill(0)
    .forEach((_, i) => {
      nodes.push({
        id: FASI[fase].toLowerCase() + "-" + i.toString(),
        data: {
          type: "normal",
          squadra1: nodi[i * 2],
          squadra2: nodi[i * 2 + 1],
        },
        style: {
          gridColumnStart: NUMERO_FASI - fase,
          gridRowStart: i * 2 ** (NUMERO_FASI - fase - 1) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase - 1),
        },
        winner: 1,
      });
    });
  if (fase == 0) continue;
  Array(2 ** fase)
    .fill(0)
    .forEach((_, i) => {
      const source = FASI[fase].toLowerCase() + "-" + i.toString();
      const target = FASI[fase - 1].toLowerCase() + "-" + parseInt(i / 2);
      edges.push({
        id: source + "__" + target,
        source,
        target,
        sourceHandle: i % 4 < 2 ? "top" : "bottom",
        targetHandle: i % 2 ? "bottom" : "top",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: { stroke: "green" },
      });
    });
  Array(fase < NUMERO_FASI - 1 ? 2 ** (fase - 1) : 0)
    .fill(0)
    .forEach((_, i) => {
      nodes.push({
        id: FASI[fase].toLowerCase() + "-r-" + i.toString(),
        data: {
          type: "ripescaggio",
        },
        style: {
          gridColumnStart: NUMERO_FASI - fase,
          gridRowStart: i * 2 ** (NUMERO_FASI - fase) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase),
        },
      });
    });
  Array(fase > 1 ? 2 ** fase : 0)
    .fill(0)
    .forEach((_, i) => {
      const source = FASI[fase].toLowerCase() + "-" + i.toString();
      const target = FASI[fase - 1].toLowerCase() + "-r-" + parseInt(i / 4);
      edges.push({
        id: source + "__" + target,
        source,
        target,
        sourceHandle: i % 4 < 2 ? "bottom" : "top",
        targetHandle: i % 4 < 2 ? "top" : "bottom",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        className: "red",
      });
    });
}

// Fase ripescaggio
for (let fase = 1; fase < NUMERO_FASI - 1; fase++) {
  nodes.push({
    data: {
      type: "header",
      fase: FASI[fase] + " R",
    },
    style: {
      gridColumnStart: NUMERO_FASI + fase,
      gridRowStart: 1,
      gridRowEnd: 2,
    },
  });
  const nodi = algoritmo(fase + 2);
  Array(2 ** fase)
    .fill(0)
    .forEach((_, i) => {
      nodes.push({
        id: FASI[fase].toLowerCase() + "-r1-" + i.toString(),
        data: {
          type: "normal",
          squadra1: nodi[i * 4 + 1],
          squadra2: nodi[i * 4 + 3],
        },
        style: {
          gridColumnStart: NUMERO_FASI + fase,
          gridRowStart: i * 2 ** (NUMERO_FASI - fase - 1) + 2,
          gridRowEnd: "span " + 2 ** (NUMERO_FASI - fase - 1),
        },
        winner: 1,
      });
    });
  Array(2 ** fase)
    .fill(0)
    .forEach((_, i) => {
      const source = FASI[fase].toLowerCase() + "-" + i.toString();
      const target = FASI[fase - 1].toLowerCase() + "-" + parseInt(i / 2);
      edges.push({
        id: source + "__" + target,
        source,
        target,
        sourceHandle: i % 4 < 2 ? "top" : "bottom",
        targetHandle: i % 2 ? "bottom" : "top",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: { stroke: "green" },
      });
    });
}

/**
 * Ripescaggio
 */

// Ottavi
// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     nodes.push({
//       id: "ottavi-r1-" + i.toString(),
//       data: {
//         type: "normal",
//         squadra1: ottavi[i] + 16,
//         squadra2: 33 - ottavi[i],
//       },
//       style: {
//         gridRowStart: i * 2 + 2,
//         gridColumnStart: 11,
//         gridRowEnd: "span 2",
//       },
//       winner: 1,
//     });
//   });

// // Ottavi
// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     nodes.push({
//       id: "ottavi-r2-" + i.toString(),
//       data: {
//         type: "normal",
//         squadra1: ottavi[i] + 8,
//         squadra2: ottavi[i] + 16,
//       },
//       style: {
//         gridRowStart: i * 2 + 2,
//         gridColumnStart: 10,
//         gridRowEnd: "span 2",
//       },
//       winner: 1,
//     });
//   });

// // Quarti 1
// Array(4)
//   .fill(0)
//   .forEach((_, i) => {
//     nodes.push({
//       id: "quarti-r1-" + i.toString(),
//       data: {
//         type: "normal",
//         squadra1: quarti[i] + 8,
//         squadra2: 17 - quarti[i],
//       },
//       style: {
//         gridRowStart: i * 4 + 2,
//         gridColumnStart: 9,
//         gridRowEnd: "span 4",
//       },
//       winner: 1,
//     });
//   });

// // Quarti 2
// Array(2)
//   .fill(0)
//   .forEach((_, i) => {
//     nodes.push({
//       id: "quarti-r2-" + i.toString(),
//       data: {
//         type: "normal",
//         squadra1: semifinali[i] + 8,
//         squadra2: 13 - semifinali[i],
//       },
//       style: {
//         gridRowStart: i * 8 + 2,
//         gridColumnStart: 8,
//         gridRowEnd: "span 8",
//       },
//       winner: 1,
//     });
//   });

/**
 *
 * EDGES
 *
 */

// Array(16)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "sedicesimi-" + i;
//     const target = "ottavi-" + parseInt(i / 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "top" : "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       style: { stroke: "green" },
//     });
//   });

// Array(16)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "sedicesimi-" + i;
//     const target = "ottavi-r-" + parseInt(i / 4);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "bottom" : "top",
//       targetHandle: i % 4 < 2 ? "top" : "bottom",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       style: { stroke: "red" },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "ottavi-" + i;
//     const target = "quarti-" + parseInt(i / 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "top" : "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       style: { stroke: "green" },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "ottavi-" + i;
//     const target = "quarti-r-" + parseInt(i / 4);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "bottom" : "top",
//       targetHandle: i % 4 < 2 ? "top" : "bottom",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       style: { stroke: "red" },
//     });
//   });
// Array(4)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "quarti-" + i;
//     const target = "semifinali-" + parseInt(i / 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "top" : "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       style: { stroke: "green" },
//     });
//   });

// Array(4)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "quarti-" + i;
//     const target = "semifinali-r-" + parseInt(i / 4);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "bottom" : "top",
//       targetHandle: i % 4 < 2 ? "top" : "bottom",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       className: "red",
//     });
//   });

// Array(2)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "semifinali-" + i;
//     const target = "finali-" + parseInt(i / 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: i % 4 < 2 ? "top" : "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left,
//       className: "green",
//     });
//   });

// Array(4)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "ottavi-" + i;
//     const target = "quarti-" + (parseInt(i / 2) + parseInt(i / 4) * 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "top",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "green" },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "ottavi-" + i;
//     const target = "quarti-" + (parseInt(i / 2) + parseInt(i / 4) * 2 + 2);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "red", strokeWidth: 1 },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "quarti-" + i;
//     const target = "semifinali-" + parseInt(i / 2) * 2;
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "top",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "green" },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "quarti-" + i;
//     const target = "semifinali-" + (parseInt(i / 2) * 2 + 1);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "bottom",
//       targetHandle: i % 2 ? "bottom" : "top",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "red", strokeWidth: 1 },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "semifinali-" + i;
//     const target = "finali-" + (i % 4) * 2;
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "top",
//       targetHandle: "middle",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "green" },
//     });
//   });

// Array(8)
//   .fill(0)
//   .forEach((_, i) => {
//     const source = "semifinali-" + i;
//     const target = "finali-" + ((i % 4) * 2 + 1);
//     edges.push({
//       id: source + "__" + target,
//       source,
//       target,
//       sourceHandle: "bottom",
//       targetHandle: "middle",
//       sourcePosition: i < 4 ? Position.Right : Position.Left,
//       targetPosition: i < 4 ? Position.Left : Position.Right,
//       style: { stroke: "red", strokeWidth: 1 },
//     });
//   });

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

export function calculateEdges() {
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

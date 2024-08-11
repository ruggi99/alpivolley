import { getBezierPath, Position } from "@xyflow/react";

export const nodes = [];
export const edges = [];

Array(32)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "trentaduesimi-" + i.toString(),
      data: {
        fase: "32esimo " + (i + 1),
      },
      style: {
        gridRowStart: (i % 16) + 2,
        gridColumnStart: i < 16 ? 1 : 11,
      },
      winner: (i % 2) + 1,
    });
  });

Array(16)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "sedicesimi-" + i.toString(),
      data: {
        fase: "16esimo " + (i + 1),
      },
      style: {
        gridRowStart: (i % 8) * 2 + 2,
        gridColumnStart: i < 8 ? 2 : 10,
        gridRowEnd: "span 2",
      },
      winner: (i % 2) + 1,
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "ottavi-" + i.toString(),
      data: {
        fase: "Ottavo " + (i + 1),
      },
      style: {
        gridRowStart: (i % 4) * 4 + 2,
        gridColumnStart: i < 4 ? 3 : 9,
        gridRowEnd: "span 4",
      },
      winner: (i % 2) + 1,
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "quarti-" + i.toString(),
      data: {
        fase: "Quarto " + (i + 1),
      },
      style: {
        gridRowStart: (i % 4) * 4 + 2,
        gridColumnStart: i < 4 ? 4 : 8,
        gridRowEnd: "span 4",
      },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "semifinali-" + i.toString(),
      data: {
        fase: "Semifinale " + (i + 1),
      },
      style: {
        gridRowStart: (i % 4) * 4 + 2,
        gridColumnStart: i < 4 ? 5 : 7,
        gridRowEnd: "span 4",
      },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    nodes.push({
      id: "finali-" + i.toString(),
      data: {
        fase: "Finale " + ((i + 1) * 2 - 1) + "-" + (i + 1) * 2,
      },
      style: {
        gridColumnStart: 6,
        gridRowStart: i * 2 + 2,
        gridRowEnd: "span 2",
      },
    });
  });

/**
 *
 * EDGES
 *
 */
Array(32)
  .fill(0)
  .forEach((_, i) => {
    const source = "trentaduesimi-" + i;
    const target = "sedicesimi-" + parseInt(i / 2);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "middle",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 16 ? Position.Right : Position.Left,
      targetPosition: i < 16 ? Position.Left : Position.Right,
      style: { stroke: "green" },
    });
  });

Array(16)
  .fill(0)
  .forEach((_, i) => {
    const source = "sedicesimi-" + i;
    const target = "ottavi-" + parseInt(i / 2);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "middle",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 8 ? Position.Right : Position.Left,
      targetPosition: i < 8 ? Position.Left : Position.Right,
      style: { stroke: "green" },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "ottavi-" + i;
    const target = "quarti-" + (parseInt(i / 2) + parseInt(i / 4) * 2);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "top",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "green" },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "ottavi-" + i;
    const target = "quarti-" + (parseInt(i / 2) + parseInt(i / 4) * 2 + 2);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "bottom",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "red", strokeWidth: 1 },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "quarti-" + i;
    const target = "semifinali-" + parseInt(i / 2) * 2;
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "top",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "green" },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "quarti-" + i;
    const target = "semifinali-" + (parseInt(i / 2) * 2 + 1);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "bottom",
      targetHandle: i % 2 ? "bottom" : "top",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "red", strokeWidth: 1 },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "semifinali-" + i;
    const target = "finali-" + (i % 4) * 2;
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "top",
      targetHandle: "middle",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "green" },
    });
  });

Array(8)
  .fill(0)
  .forEach((_, i) => {
    const source = "semifinali-" + i;
    const target = "finali-" + ((i % 4) * 2 + 1);
    edges.push({
      id: source + "__" + target,
      source,
      target,
      sourceHandle: "bottom",
      targetHandle: "middle",
      sourcePosition: i < 4 ? Position.Right : Position.Left,
      targetPosition: i < 4 ? Position.Left : Position.Right,
      style: { stroke: "red", strokeWidth: 1 },
    });
  });

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
    paths.push({ path, style: edge.style, id: edge.id });
  }
  return paths;
}

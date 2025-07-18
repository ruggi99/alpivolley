import cs from "classnames";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";
import { SqRounded } from "components/Partita";
import { FASI } from "lib/const";
import { calculateHeaders } from "lib/eliminazione";

export function NodeGrid({ children, viewFase }) {
  return (
    <div className="-mx-4 overflow-x-scroll px-4">
      <div id="viewport" className="relative w-min">
        <div
          id="nodes"
          className="grid place-items-center gap-x-20 gap-y-2"
          style={{
            gridTemplateColumns: "repeat(" + viewFase + ", auto)",
            gridTemplateRows: "repeat(" + (2 ** (viewFase - 1) + 1) + ", auto)",
          }}
        >
          <Header viewFase={viewFase} />
          {children}
        </div>
      </div>
    </div>
  );
}

function Header({ viewFase }) {
  const nodeHeaders = calculateHeaders(viewFase);
  return (
    <>
      {nodeHeaders.map((node, i) => (
        <Node key={i} node={node} />
      ))}
    </>
  );
}

export function Node(props) {
  const { node, setNumber } = props;
  const { data } = node;
  if (data.type == "ripescaggio") {
    return (
      <div
        id={node.id}
        style={node.style}
        className="w-full rounded-lg border p-2 text-center whitespace-nowrap text-red-500"
      >
        Ripescaggio {data.number}
      </div>
    );
  } else if (data.type == "header") {
    return (
      <div
        id={node.id}
        style={node.style}
        className="w-full rounded-lg border p-2 text-center"
      >
        {data.fase}
      </div>
    );
  }
  return (
    <Disclosure
      as="div"
      className="w-full rounded-lg border p-4 pb-2"
      id={node.id}
      style={node.style}
      onClick={() => setNumber((v) => v + 1)}
    >
      <DisclosureButton
        style={{
          gridTemplateRows: "repeat(4, auto)",
          gridTemplateColumns: "repeat(2, auto)",
        }}
        className="group grid w-full place-items-center gap-2 whitespace-nowrap"
      >
        <SqRounded color="bg-squadre-1 w-min" className="row-start-1">
          Squadra {data.squadra1}
        </SqRounded>
        <div
          className={cs("col-start-2 row-start-1", {
            "text-2xl text-green-600": node.winner == "1",
            "text-red-600": node.winner == "2",
          })}
        >
          22
        </div>
        <hr className="col-span-2 col-start-1 row-start-2 w-full" />
        <SqRounded
          color="bg-squadre-2 w-min"
          className="col-start-1 row-start-3"
        >
          Squadra {data.squadra2}
        </SqRounded>
        <div
          className={cs("col-start-2 row-start-3", {
            "text-2xl text-green-600": node.winner == "2",
            "text-red-600": node.winner == "1",
          })}
        >
          20
        </div>
        <ChevronDownIcon className="col-span-2 col-start-1 row-start-4 h-4 w-4 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="mt-2 mb-2 flex place-items-center justify-evenly">
        <span
          className={cs(
            "grid h-8 w-8 place-items-center rounded-md font-semibold text-white",
            data["Campo"] ? "bg-green-600" : "bg-red-600",
          )}
        >
          {data["Campo"] || "ND"}
        </span>
        <div className="flex">
          <ClockIcon className="h-8 w-8" /> 9:00
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export function Nodes(props) {
  const { nodes, setNumber } = props;
  return (
    <>
      {nodes.map((v, i) => (
        <Node key={i} node={v} setNumber={setNumber} />
      ))}
    </>
  );
}

export function Edges(props) {
  const { edges } = props;
  return (
    <div id="edges" className="absolute inset-0 -z-10">
      <svg className="h-full w-full" id="svg-edges">
        {edges.map((v, i) => (
          <path
            className={cs("fill-none", v.className)}
            key={i}
            id={v.id}
            d={v.path}
            style={v.style}
            strokeDasharray="10"
            strokeDashoffset="1"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="100;0"
              dur="5s"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </path>
        ))}
      </svg>
    </div>
  );
}

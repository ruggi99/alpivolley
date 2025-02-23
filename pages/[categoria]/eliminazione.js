import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";
import cs from "classnames";

import DataUpdate from "components/DataUpdate";
import { SqRounded } from "components/Partita";
import Title from "components/Title";
import { CATEGORIE, REVALIDATE } from "lib/const";
import {
  calculateEdgeCoords,
  calculateEdges,
  calculateFakeData,
  calculateNodes,
} from "lib/eliminazione2";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

const NUMERO_FASI = 4;

export default function Eliminazione(pageProps) {
  const { data, numero_fasi, update } = useUpdatedData(pageProps);
  const [number, setNumber] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { query } = useRouter();
  useEffect(() => {
    const _nodes = calculateNodes(data);
    console.log(_nodes);
    setNodes(_nodes);
  }, [data, number]);
  useEffect(() => {
    console.log(
      nodes,
      document.getElementById("viewport").children[0].children.length,
    );
    if (!nodes.length) return; // Da sistemare
    const _edges = calculateEdges(NUMERO_FASI + 1);
    console.log(_edges);
    setEdges(calculateEdgeCoords(_edges));
  }, [nodes]);
  return (
    <>
      <Title>{firstLetterUp(query.categoria) + " - Eliminazione"}</Title>
      <DataUpdate update={update} />
      <h3 className="text-center">
        Categoria {firstLetterUp(query.categoria)} - Eliminazione
      </h3>
      <div style={{ overflowX: "scroll" }} className="-m-4 p-4">
        <div id="viewport" className="relative w-min">
          <div
            id="nodes"
            className="grid place-items-center gap-x-20 gap-y-2"
            style={{
              gridTemplateColumns:
                "repeat(" +
                (numero_fasi + 2 + (numero_fasi - 1) * 2) +
                ", auto)",
              gridTemplateRows:
                "repeat(" + (2 ** (numero_fasi - 1) + 1) + ", auto)",
            }}
          >
            {nodes.map((v, i) => (
              <Node key={i} node={v} setNumber={setNumber} />
            ))}
            {/* <div className="col-start-1 row-span-8 row-start-2 h-full w-full bg-red-50/40" /> */}
          </div>
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
        </div>
      </div>
    </>
  );
}

function Node(props) {
  const { node, setNumber } = props;
  const { data } = node;
  if (data.type == "ripescaggio") {
    return (
      <div
        id={node.id}
        style={node.style}
        className="w-full whitespace-nowrap rounded-lg border p-2 text-center text-red-500"
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
      <DisclosurePanel className="mb-2 mt-2 flex place-items-center justify-evenly">
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

export async function getStaticProps({ params }) {
  if (!CATEGORIE.includes(params.categoria)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  // const response = await getRows(params.categoria, "Eliminazione");
  // const response = [];
  // const classifica = calcClassificaAvulsa(response.results);
  return {
    props: {
      data: calculateFakeData(NUMERO_FASI),
      numero_fasi: NUMERO_FASI,
      update: new Date().toJSON(),
    },
    revalidate: REVALIDATE,
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

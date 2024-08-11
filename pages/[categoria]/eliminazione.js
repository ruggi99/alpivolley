import { useEffect, useState } from "react";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import cs from "classnames";

import DataUpdate from "components/DataUpdate";
import { SqRounded } from "components/Partita";
import { CATEGORIE, REVALIDATE } from "lib/const";
import { calculateEdges, nodes } from "lib/eliminazione";
import useUpdatedData from "lib/useUpdatedData";

export default function Eliminazione(pageProps) {
  const { data, update } = useUpdatedData(pageProps);
  const [number, setNumber] = useState(0);
  const [edges, setEdges] = useState([]);
  useEffect(() => {
    const edges = calculateEdges();
    setEdges(edges);
  }, [number]);
  return (
    <>
      <DataUpdate update={update} />
      <div style={{ overflowX: "scroll" }} className="-m-4 p-4">
        <div id="viewport" className="relative w-min">
          <div
            id="nodes"
            className="grid place-items-center gap-x-20 gap-y-2"
            style={{
              gridTemplateColumns: "repeat(11, auto)",
              gridTemplateRows: "repeat(17, auto)",
            }}
          >
            <Header />
            {data.map((v, i) => (
              <Disclosure
                as="div"
                key={i}
                className="w-full rounded-lg border p-4 pb-2"
                id={v.id}
                style={v.style}
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
                    Squadra {i ** 3}
                  </SqRounded>
                  <div
                    className={cs("col-start-2 row-start-1", {
                      "text-2xl text-green-600": v.winner == "1",
                      "text-red-600": v.winner == "2",
                    })}
                  >
                    20
                  </div>
                  <hr className="col-span-2 col-start-1 row-start-2 w-full" />
                  <SqRounded
                    color="bg-squadre-2 w-min"
                    className="col-start-1 row-start-3"
                  >
                    Squadra 2
                  </SqRounded>
                  <div
                    className={cs("col-start-2 row-start-3", {
                      "text-2xl text-green-600": v.winner == "2",
                      "text-red-600": v.winner == "1",
                    })}
                  >
                    22
                  </div>
                  <ChevronDownIcon className="col-span-2 col-start-1 row-start-4 h-4 w-4 group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mb-2 mt-2 flex place-items-center justify-evenly">
                  <span
                    className={cs(
                      "grid h-8 w-8 place-items-center rounded-md font-semibold text-white",
                      v["Campo"] ? "bg-green-600" : "bg-red-600",
                    )}
                  >
                    {v["Campo"] || "ND"}
                  </span>
                  <div>Orario 9:00</div>
                </DisclosurePanel>
              </Disclosure>
            ))}
            {/* <div className="col-start-1 row-span-8 row-start-2 h-full w-full bg-red-50/40" /> */}
          </div>
          <div id="edges" className="absolute inset-0 -z-10">
            <svg className="h-full" style={{ width: "100%" }}>
              {edges.map((v, i) => (
                <path
                  className="fill-none stroke-2"
                  key={i}
                  id={v.id}
                  d={v.path}
                  style={v.style}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  const commonClassName =
    "border rounded-lg p-2 w-full text-center row-start-1";
  const FASI = [
    "Trentaduesimi",
    "Sedicesimi",
    "Ottavi",
    "Quarti",
    "Semifinali",
    "Finali",
  ];
  return (
    <>
      {FASI.map((v, i) => (
        <div
          key={i}
          style={{ gridColumnStart: i + 1 }}
          className={cs(commonClassName, "header-" + v.toLowerCase())}
        >
          {v}
        </div>
      ))}
      {FASI.slice(0, -1)
        .reverse()
        .map((v, i) => (
          <div
            key={i}
            style={{ gridColumnStart: i + 7 }}
            className={cs(commonClassName, "header-" + v.toLowerCase())}
          >
            {v}
          </div>
        ))}
    </>
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
      data: nodes,
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

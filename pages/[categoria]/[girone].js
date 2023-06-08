import { useMemo, useState } from "react";

import { useRouter } from "next/router";

import { Disclosure, Switch, Tab } from "@headlessui/react";
import cs from "classnames";

import DataUpdate from "components/DataUpdate";
import Title from "components/Title";
import { getPuntiColor, getSqColor } from "lib/colors";
import {
  AIRTABLE_API_URL,
  categorie,
  gironi,
  maxGironi,
  revalidate,
} from "lib/const";
import {
  EnumClassifica,
  EnumClassificaRev,
  EnumNomiRev,
  transformEnum,
} from "lib/enums";
import { howManyPoints, useClassifica } from "lib/useClassifica";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

function Girone(pageProps) {
  // data: array di array delle partite
  // nomi: array di array dei nomi delle squadre
  // update: ultimo aggiornamento dati
  const { data: data_old, update } = useUpdatedData(pageProps);
  const data = useMemo(() => {
    return data_old.filter((p) => p["Squadra 1"] && p["Squadra 2"]);
  }, [data_old]);
  const nomi = getNomifromData(data);
  const { query } = useRouter();
  return (
    <div className="mx-auto flex h-full w-fit flex-1 flex-col gap-2">
      <Title>
        {firstLetterUp(query.categoria) + " - Girone " + query.girone}
      </Title>
      <DataUpdate update={update} />
      <h3 className="text-center">
        Categoria {firstLetterUp(query.categoria)} - Girone {query.girone}
      </h3>
      <Tab.Group>
        <Tab.List className="mx-auto flex w-full justify-center gap-2 border-b">
          <Tab className={tabClassname}>Partite</Tab>
          <Tab className={tabClassname}>Classifica</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Partite data={data} nomi={nomi} />
          </Tab.Panel>
          <Tab.Panel>
            <Classifica data={data} nomi={nomi} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Girone;

function getNomifromData(data) {
  const nomi = [];
  for (var row of data) {
    if (
      nomi.findIndex((v) => row["Squadra 1"][0] == v[EnumNomiRev.Nome]) == -1
    ) {
      nomi.push([row["Squadra 1"][0]]);
    }
    if (
      nomi.findIndex((v) => row["Squadra 2"][0] == v[EnumNomiRev.Nome]) == -1
    ) {
      nomi.push([row["Squadra 2"][0]]);
    }
  }
  return nomi;
}

const tabClassname = ({ selected }) =>
  cs(
    "px-4 py-2 font-bold",
    selected && "border-b-2 border-primary-green text-primary-green"
  );

function Partite({ data, nomi }) {
  const [showFinished, setShowFinished] = useState(false);
  const [partiteFinite, partiteInCorso, partiteDaGiocare] = useMemo(() => {
    const partiteInCorso = [];
    const partiteFinite = [];
    const partiteDaGiocare = [];
    for (var p of data) {
      if (p.Status == "Terminata") {
        partiteFinite.push(p);
      } else if (p.Status == "In Corso") {
        partiteInCorso.push(p);
      } else {
        partiteDaGiocare.push(p);
      }
    }
    return [partiteFinite, partiteInCorso, partiteDaGiocare];
  }, [data]);
  return (
    <div className="max-w-xl space-y-2">
      <div className="all-center my-4 flex gap-2">
        <Switch
          checked={showFinished}
          onChange={setShowFinished}
          className={cs(
            showFinished ? "bg-primary-green" : "bg-gray-500",
            "relative inline-flex h-[25px] w-[49px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
          )}
        >
          <span className="sr-only">Mostra le partite finite</span>
          <span
            aria-hidden="true"
            className={cs(
              showFinished ? "translate-x-6" : "translate-x-0",
              "pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
        <span>Mostra le partite finite</span>
      </div>
      <div className="gap-4 px-4 sm:flex">
        <div className="flex basis-2/3 justify-evenly gap-2">
          <h3 className="whitespace-nowrap font-bold">Squadra 1</h3>
          <span className="text-white">VS</span>
          <h3 className="whitespace-nowrap font-bold">Squadra 2</h3>
        </div>
        <div className="hidden basis-1/3 justify-center sm:flex">
          <h3 className="whitespace-nowrap font-bold">Arbitro</h3>
        </div>
      </div>
      {showFinished &&
        (partiteFinite.length ? (
          <>
            <h2 className="text-center">Partite finite:</h2>
            {partiteFinite.map((v, i) => {
              const rowPoints = howManyPoints(v);
              return (
                <Partita key={i} v={v} nomi={nomi} rowPoints={rowPoints} />
              );
            })}
          </>
        ) : (
          <h2 className="text-center">Nessuna partita finita</h2>
        ))}
      {!!partiteInCorso.length && (
        <h2 className="text-center">Partite in corso:</h2>
      )}
      {partiteInCorso.map((v, i) => {
        return <Partita key={i} v={v} nomi={nomi} />;
      })}
      {partiteDaGiocare.length ? (
        <h2 className="text-center">Partite da giocare:</h2>
      ) : (
        <h2 className="text-center">Nessuna partita da giocare</h2>
      )}
      {partiteDaGiocare.map((v, i) => {
        return <Partita key={i} v={v} nomi={nomi} />;
      })}
    </div>
  );
}

function Partita({ nomi, rowPoints, v }) {
  return (
    <Disclosure as="div" className="rounded-lg border">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={cs(
              "w-full items-center gap-4 py-2 px-4 sm:flex",
              rowPoints && !open && "opacity-50"
            )}
          >
            <div className="flex basis-2/3 items-center justify-evenly gap-2">
              <div className="w-full min-w-0 flex-1">
                <SqRounded color={getSqColor(v["Squadra 1"][0], nomi)}>
                  {v["Squadra 1"][0]}
                </SqRounded>
              </div>
              <span>VS</span>
              <div className="w-full min-w-0 flex-1">
                <SqRounded color={getSqColor(v["Squadra 2"][0], nomi)}>
                  {v["Squadra 2"][0]}
                </SqRounded>
              </div>
            </div>
            <div className="all-center mt-2 basis-1/3 gap-2 sm:mt-0 sm:flex">
              <h3 className="font-bold sm:hidden">Arbitro: </h3>
              <div className="flex-1">
                <SqRounded color={getSqColor(v["Arbitro"]?.[0], nomi)}>
                  {v["Arbitro"]?.[0] || "STAFF"}
                </SqRounded>
              </div>
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-2 px-4 py-2">
            <div className="all-center flex">
              {/* <div className="w-full text-center">n° {i + 1}</div> */}
              <div className="all-center flex w-full gap-2 text-center">
                <Campo v={v} />
              </div>
            </div>
            {rowPoints && (
              <div className="flex justify-evenly border-t">
                <span
                  className={cs(
                    "text-2xl font-semibold",
                    getPuntiColor(rowPoints[0])
                  )}
                >
                  {rowPoints[0]}
                </span>
                <div
                  className={cs(
                    "text-4xl font-bold",
                    getPuntiColor(rowPoints[0])
                  )}
                >
                  {v["Punti 1"]}
                </div>
                <div
                  className={cs(
                    "text-4xl font-bold",
                    getPuntiColor(rowPoints[1])
                  )}
                >
                  {v["Punti 2"]}
                </div>
                <div
                  className={cs(
                    "text-2xl font-semibold",
                    getPuntiColor(rowPoints[1])
                  )}
                >
                  {rowPoints[1]}
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function SqRounded({ children, color }) {
  return (
    <div className={cs("rounded-xl p-2 px-4 py-1", color)}>{children}</div>
  );
}

function Campo({ v }) {
  return (
    <>
      Campo{" "}
      <span
        className={cs(
          "grid h-8 w-8 place-items-center rounded-md font-semibold text-white",
          v["Campo"] ? "bg-green-600" : "bg-red-600"
        )}
      >
        {v["Campo"] || "ND"}
      </span>
    </>
  );
}

function Classifica({ data, nomi }) {
  // return: array di array. Non la migliore struttura da usare
  const classifica = useClassifica(data, nomi);
  return (
    <table className="no-second-child border-separate border-spacing-x-0 border-spacing-y-2">
      <thead>
        <tr>
          {EnumClassifica.map((v) => (
            <th key={v}>{transformEnum(v)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classifica.map((v, i) => (
          <tr key={i} className={getSqColor(v[EnumClassificaRev.Nome], nomi)}>
            {v.map((v, i) => (
              <td className="" key={i}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Path validi a questo livello
const paths = categorie
  .map((c) =>
    Array(3)
      .fill(0)
      .map((_, i) =>
        Array(gironi[c])
          .fill(0)
          .map((_, k) => `/${c}/${String.fromCharCode(65 + maxGironi * i + k)}`)
      )
  )
  .flat(2);

export async function getStaticProps({ params }) {
  if (paths.indexOf(`/${params.categoria}/${params.girone}`) == -1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];
  const res = await fetch(
    `${AIRTABLE_API_URL}/${baseID}/${
      params.categoria == "men" ? "Gare%20M" : "Gare%20F"
    }?filterByFormula=Girone="${params.girone}"&view=Scontri`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const response = await res.json();
  return {
    props: {
      data: response.records.map((v) => v.fields),
      update: new Date().toJSON(),
    },
    revalidate,
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

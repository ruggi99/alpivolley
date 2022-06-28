import { useState } from "react";

import { useRouter } from "next/router";

import { Disclosure, Switch, Tab } from "@headlessui/react";
import cs from "classnames";
import fs from "fs";
import path from "path";

import DataUpdate from "components/DataUpdate";
import Title from "components/Title";
import { getPuntiColor, getSqColor } from "lib/colors";
import { categorie, gironi, revalidate } from "lib/const";
import {
  EnumClassifica,
  EnumClassificaRev,
  EnumDataRev,
  transformEnum,
} from "lib/enums";
import { getClient } from "lib/google";
import { howManyPoints, useClassifica } from "lib/useClassifica";
import useUpdatedData from "lib/useUpdatedData";

function Girone(pageProps) {
  // data: array di array delle partite
  // nomi: array di array dei nomi delle squadre
  // update: ultimo aggiornamento dati
  const { data, nomi, update } = useUpdatedData(pageProps);
  const { query } = useRouter();
  return (
    <div className="mx-auto flex h-full w-fit flex-1 flex-col gap-2">
      <Title>{`${query.categoria} - Girone ${query.girone}`}</Title>{" "}
      <DataUpdate update={update} />
      <h3 className="text-center">
        Categoria {query.categoria} - Girone {query.girone}
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

const tabClassname = ({ selected }) =>
  cs(
    "px-4 py-2 font-bold",
    selected && "border-b-2 border-primary-green text-primary-green"
  );

function Partite({ data, nomi }) {
  const [showFinished, setShowFinished] = useState(false);
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
          <h3 className="font-bold">Squadra 1</h3>
          <span className="text-white">VS</span>
          <h3 className="font-bold">Squadra 2</h3>
        </div>
        <div className="hidden basis-1/3 justify-center sm:flex">
          <h3 className="font-bold">Arbitro</h3>
        </div>
      </div>
      {data.map((v, i) => {
        const rowPoints = howManyPoints(v);
        if (rowPoints && !showFinished) {
          return null;
        }
        return (
          <Disclosure key={i} as="div" className="rounded-lg border">
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
                      <SqRounded
                        color={getSqColor(v[EnumDataRev.Squadra_1], nomi)}
                      >
                        {/* {v[EnumDataRev.Squadra_1].repeat(5)} */}
                        Lorem ipsum dolor sit amet
                      </SqRounded>
                    </div>
                    <span>VS</span>
                    <div className="w-full min-w-0 flex-1">
                      <SqRounded
                        color={getSqColor(v[EnumDataRev.Squadra_2], nomi)}
                      >
                        {/* {v[EnumDataRev.Squadra_2]} */}
                        Lorem ipsum dolor sit amet
                      </SqRounded>
                    </div>
                  </div>
                  <div className="all-center mt-2 basis-1/3 gap-2 sm:mt-0 sm:flex">
                    <h3 className="font-bold sm:hidden">Arbitro: </h3>
                    <SqRounded color={getSqColor(v[EnumDataRev.Arbitro], nomi)}>
                      {/* {v[EnumDataRev.Arbitro].repeat(10)} */}
                      Lorem ipsum dolor sit amet
                    </SqRounded>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="space-y-2 px-4 py-2">
                  <div className="all-center flex">
                    <div className="w-full text-center">n° {i + 1}</div>
                    <div className="w-full text-center font-roboto">
                      &#x1F551;{" "}
                      <time
                        dateTime={v[EnumDataRev.Orario]
                          .substring(0, 4)
                          .replaceAll(".", ":")}
                      >
                        {v[EnumDataRev.Orario]
                          .substring(0, 4)
                          .replaceAll(".", ":")}
                      </time>
                    </div>
                    <div className="all-center flex w-full gap-2 text-center">
                      Campo{" "}
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-green-600 font-semibold text-white">
                        {v[EnumDataRev.Campo]}
                      </span>
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
                        {v[EnumDataRev.Punteggio$1]}
                      </div>
                      <div
                        className={cs(
                          "text-4xl font-bold",
                          getPuntiColor(rowPoints[1])
                        )}
                      >
                        {v[EnumDataRev.Punteggio$2]}
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
      })}
    </div>
  );
}

function SqRounded({ children, color }) {
  return (
    <div className={cs("rounded-xl p-2 px-4 py-1", color)}>{children}</div>
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

const queryGoogle = false;

// Path validi a questo livello
const paths = categorie
  .map((c) =>
    Array(gironi[c])
      .fill(0)
      .map((_, i) => `/${c}/${String.fromCharCode(65 + i)}`)
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
  var values;
  if (queryGoogle && process.env.FETCH_GOOGLE) {
    const client = await getClient();
    values = (
      await client.spreadsheets.values.batchGet({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        ranges: getRanges(params),
      })
    ).data.valueRanges;
    fs.writeFileSync("public/data.json", JSON.stringify(values));
  } else {
    values = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public/data.json"))
    );
  }
  return {
    props: {
      data: values[0].values,
      nomi: values[1].values,
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

function getRanges(/* query */) {
  return ["Partite_A", "Nomi_A"];
}

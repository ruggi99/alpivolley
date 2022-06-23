import { useMemo, useState } from "react";

import { Disclosure, Switch, Tab } from "@headlessui/react";
import cs from "classnames";
import fs from "fs";
import { useRouter } from "next/router";
import path from "path";

import Title from "components/Title";
import { getPuntiColor, getSqColor } from "lib/colors";
import { EnumClassificaRev, EnumDataRev, EnumNomiRev } from "lib/enums";
import { getClient } from "lib/google";

export default function Girone({ data, nomi }) {
  // data: array di array delle partite
  // nomi: array di array dei nomi delle squadre
  const router = useRouter();
  return (
    <div className="space-y-2">
      <Title>{`AlpiVolley | ${router.query.categoria} - Girone ${router.query.girone}`}</Title>
      <Tab.Group>
        <Tab.List className="mx-auto flex w-min justify-center gap-2 border-b">
          <Tab
            className={({ selected }) =>
              cs(
                "px-4 py-2 font-bold",
                selected && "border-b-2 border-primary-green text-primary-green"
              )
            }
          >
            Partite
          </Tab>
          <Tab
            className={({ selected }) =>
              cs(
                "px-4 py-2 font-bold",
                selected && "border-b-2 border-primary-green text-primary-green"
              )
            }
          >
            Classifica
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Partite2 data={data} nomi={nomi} />
          </Tab.Panel>
          <Tab.Panel>
            <Classifica data={data} nomi={nomi} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function Partite2({ data, nomi }) {
  const [showFinished, setShowFinished] = useState(false);
  return (
    <div className="mx-auto max-w-xl space-y-2">
      <div className="all-center flex gap-2">
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
                        color={getSqColor(
                          EnumDataRev.Squadra_1,
                          v[EnumDataRev.Squadra_1],
                          nomi
                        )}
                      >
                        {/* {v[EnumDataRev.Squadra_1].repeat(5)} */}
                        Lorem ipsum dolor sit amet
                      </SqRounded>
                    </div>
                    <span>VS</span>
                    <div className="w-full min-w-0 flex-1">
                      <SqRounded
                        color={getSqColor(
                          EnumDataRev.Squadra_2,
                          v[EnumDataRev.Squadra_2],
                          nomi
                        )}
                      >
                        {/* {v[EnumDataRev.Squadra_2]} */}
                        Lorem ipsum dolor sit amet
                      </SqRounded>
                    </div>
                  </div>
                  <div className="all-center mt-2 basis-1/3 gap-2 sm:mt-0 sm:flex">
                    <h3 className="font-bold sm:hidden">Arbitro: </h3>
                    <SqRounded
                      color={getSqColor(
                        EnumDataRev.Squadra_1,
                        v[EnumDataRev.Arbitro],
                        nomi
                      )}
                    >
                      {/* {v[EnumDataRev.Arbitro].repeat(10)} */}
                      {"Lorem ipsum dolor sit amet".repeat(2)}
                    </SqRounded>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="space-y-2 px-4 py-2">
                  <div className="all-center flex">
                    <div className="w-full text-center font-roboto">
                      &#x1F551;{" "}
                      {v[EnumDataRev.Orario]
                        .substring(0, 4)
                        .replaceAll(".", ":")}
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
                          getPuntiColor(EnumDataRev.Punti_1, rowPoints)
                        )}
                      >
                        {rowPoints[0]}
                      </span>
                      <div
                        className={cs(
                          "text-4xl font-bold",
                          getPuntiColor(EnumDataRev.Punteggio_1, rowPoints)
                        )}
                      >
                        {v[EnumDataRev.Punteggio_1]}
                      </div>
                      <div
                        className={cs(
                          "text-4xl font-bold",
                          getPuntiColor(EnumDataRev.Punteggio_2, rowPoints)
                        )}
                      >
                        {v[EnumDataRev.Punteggio_2]}
                      </div>
                      <div
                        className={cs(
                          "text-2xl font-semibold",
                          getPuntiColor(EnumDataRev.Punti_2, rowPoints)
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
    <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
      <thead>
        <tr>
          <th>Squadra</th>
          <th>Punti</th>
          <th>Vittorie</th>
        </tr>
      </thead>
      <tbody>
        {classifica.map((v, i) => (
          <tr
            key={i}
            className={getSqColor(
              EnumDataRev.Squadra_1,
              v[EnumClassificaRev.Nome],
              nomi
            )}
          >
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

function useClassifica(data, nomi) {
  return useMemo(() => {
    const punti = Array(8).fill(0);
    const vittorie = Array(8).fill(0);
    // Per ogni partita calcolo i punti da assegnare e chi ha vinto
    for (const row of data) {
      const index1 = nomi.findIndex(
        (_, i) => nomi[i][EnumNomiRev.Nome] == row[EnumDataRev.Squadra_1]
      );
      const index2 = nomi.findIndex(
        (_, i) => nomi[i][EnumNomiRev.Nome] == row[EnumDataRev.Squadra_2]
      );
      const points = howManyPoints(row) || [0, 0];
      if (index1 > -1) {
        punti[index1] += points[0];
        vittorie[index1] += points[0] > 1 ? 1 : 0;
      }
      if (index2 > -1) {
        punti[index2] += points[1];
        vittorie[index2] += points[1] > 1 ? 1 : 0;
      }
    }
    const toBeSorted = [];
    // punti è usato solo come iteratore di 8 elementi
    punti.forEach((v, i) => {
      toBeSorted.push([nomi[i][EnumNomiRev.Nome], v, vittorie[i]]);
    });
    return toBeSorted.sort((a, b) => {
      // ordino per punti fatti
      if (a[EnumClassificaRev.Punti] != b[EnumClassificaRev.Punti])
        return b[EnumClassificaRev.Punti] - a[EnumClassificaRev.Punti];
      // ordino per vittorie
      if (a[EnumClassificaRev.Vittorie] != b[EnumClassificaRev.Vittorie])
        return b[EnumClassificaRev.Vittorie] - a[EnumClassificaRev.Vittorie];
      // TODO: aggiornare metodo calcolo classifica
      return 0;
    });
  }, [data, nomi]);
}

// Calcolo quanti punti assegnare alle squadre in base al punteggio della partita
function howManyPoints(row) {
  const points1 = parseInt(row[EnumDataRev.Punteggio_1]);
  const points2 = parseInt(row[EnumDataRev.Punteggio_2]);
  if (isNaN(points1) || isNaN(points2)) return null;
  if (points2 < 19) return [3, 0];
  if (points1 < 19) return [0, 3];
  if (points1 > points2) return [2, 1];
  return [1, 2];
}

const queryGoogle = false;

export async function getStaticProps({ params }) {
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
    props: { data: values[0].values, nomi: values[1].values },
    revalidate: 30,
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

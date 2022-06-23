import { getClient } from "lib/google";
import fs from "fs";
import { getSqColor, getPuntiColor } from "lib/colors";
import cs from "classnames";
import { useMemo, useState } from "react";
import path from "path";
import { useRouter } from "next/router";
import Title from "components/Title";
import {
  EnumData,
  EnumNomiRev,
  EnumDataRev,
  EnumClassificaRev,
} from "lib/enums";
import { Disclosure, Tab, Switch } from "@headlessui/react";

export default function Girone({ data, nomi }) {
  // data: array di array delle partite
  // nomi: array di array dei nomi delle squadre
  const router = useRouter();
  return (
    <div className="space-y-2">
      <Title>{`AlpiVolley | ${router.query.categoria} - Girone ${router.query.girone}`}</Title>
      <Tab.Group>
        <Tab.List className="flex justify-center border-b gap-2 w-min mx-auto">
          <Tab
            className={({ selected }) =>
              cs(
                "px-4 py-2 font-bold",
                selected && "text-primary-green border-b-2 border-primary-green"
              )
            }
          >
            Partite
          </Tab>
          <Tab
            className={({ selected }) =>
              cs(
                "px-4 py-2 font-bold",
                selected && "text-primary-green border-b-2 border-primary-green"
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

function Partite({ data, nomi }) {
  return (
    <div className="overflow-auto">
      <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
        <thead>
          <tr>
            {EnumData.map((v) => (
              <th key={v}>{v.replaceAll("_", " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => {
            const rowPoints = howManyPoints(v);
            return (
              <tr key={i} className={cs(rowPoints && "opacity-50")}>
                {v.map((v, i) => {
                  const sqColor = getSqColor(i, v, nomi);
                  const puntiColor = getPuntiColor(i, rowPoints);
                  return (
                    <td
                      className={cs(
                        (i == EnumDataRev.Punteggio_1 ||
                          i == EnumDataRev.Punteggio_2) &&
                          "font-bold",
                        "whitespace-nowrap"
                      )}
                      key={EnumData[i]}
                    >
                      {!sqColor && !puntiColor && i != EnumDataRev.Campo && v}
                      {(sqColor || puntiColor) && (
                        <span
                          className={cs(
                            "px-4 py-1 rounded-xl",
                            sqColor,
                            puntiColor
                          )}
                        >
                          {v}
                        </span>
                      )}
                      {i == EnumDataRev.Campo && (
                        <span className="grid h-8 w-8 place-items-center rounded-md bg-green-600 font-semibold text-white mx-auto">
                          {v}
                        </span>
                      )}
                    </td>
                  );
                })}
                {v.length == 5 && (
                  <>
                    <td className="font-bold">0</td>
                    <td className="font-bold">0</td>
                  </>
                )}
                {
                  <td className="font-bold">
                    <span
                      className={cs(
                        "px-4 py-1 rounded-xl",
                        getPuntiColor(EnumDataRev.Punti_1, rowPoints)
                      )}
                    >
                      {(rowPoints && rowPoints[0]) || 0}
                    </span>
                  </td>
                }
                {
                  <td className="font-bold">
                    <span
                      className={cs(
                        "px-4 py-1 rounded-xl",
                        getPuntiColor(EnumDataRev.Punti_2, rowPoints)
                      )}
                    >
                      {(rowPoints && rowPoints[1]) || 0}
                    </span>
                  </td>
                }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Partite2({ data, nomi }) {
  const [showFinished, setShowFinished] = useState(false);
  return (
    <div className="space-y-2 max-w-lg mx-auto">
      <div className="flex justify-center gap-2">
        <Switch
          checked={showFinished}
          onChange={setShowFinished}
          className={`${showFinished ? "bg-primary-green" : "bg-gray-500"}
          relative inline-flex h-[25px] w-[49px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Mostra le partite finite</span>
          <span
            aria-hidden="true"
            className={`${showFinished ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <span>Mostra le partite finite</span>
      </div>
      <div className="flex px-4 gap-4">
        <div className="flex w-2/3 gap-2 justify-evenly">
          <h3 className="font-bold">Squadra 1</h3>
          <span className="text-white">VS</span>
          <h3 className="font-bold">Squadra 2</h3>
        </div>
        <div className="flex w-1/3 justify-center">
          <h3 className="font-bold">Arbitro</h3>
        </div>
      </div>
      {data.map((v, i) => {
        const rowPoints = howManyPoints(v);
        if (rowPoints && !showFinished) {
          return null;
        }
        return (
          <Disclosure key={i} as="div" className="border rounded-lg">
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={cs(
                    "flex w-full py-2 px-4 gap-4 items-center",
                    rowPoints && !open && "opacity-50"
                  )}
                >
                  <div className="flex w-2/3 justify-evenly gap-2 items-center">
                    <div className="w-full flex-1 min-w-0">
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
                    <div className="w-full flex-1 min-w-0">
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
                  <div className="flex w-1/3 justify-center">
                    <SqRounded
                      color={getSqColor(
                        EnumDataRev.Squadra_1,
                        v[EnumDataRev.Arbitro],
                        nomi
                      )}
                    >
                      {/* {v[EnumDataRev.Arbitro].repeat(10)} */}
                      Lorem ipsum dolor sit amet
                    </SqRounded>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-2 space-y-2">
                  <div className="flex all-center">
                    <div className="w-full text-center font-roboto">
                      &#x1F551;{" "}
                      {v[EnumDataRev.Orario]
                        .substring(0, 4)
                        .replaceAll(".", ":")}
                    </div>
                    <div className="w-full text-center flex gap-2 all-center">
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
    <div className={cs("px-4 py-1 rounded-xl p-2", color)}>{children}</div>
  );
}

function Classifica({ data, nomi }) {
  // return: array di array. Non la migliore struttura da usare
  const classifica = useClassifica(data, nomi);
  return (
    <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2 no-bordo">
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

function getRanges(query) {
  return ["Partite_A", "Nomi_A"];
}

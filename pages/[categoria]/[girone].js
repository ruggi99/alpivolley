import { getClient } from "lib/google";
import fs from "fs";
import { getColor } from "lib/colors";
import cs from "classnames";
import { useMemo } from "react";
import path from "path";
import { useRouter } from "next/router";
import Title from "components/Title";

const EnumData = [
  "Orario",
  "Campo",
  "Squadra1",
  "Squadra2",
  "Arbitro",
  "Punteggio1",
  "Punteggio2",
];
const EnumNomi = ["ID", "Nome"];
const EnumClassifica = ["Nome", "Punti", "Vittorie"];

const EnumDataRev = {};
EnumData.forEach((v, i) => (EnumDataRev[v] = i));

const EnumNomiRev = {};
EnumNomi.forEach((v, i) => (EnumNomiRev[v] = i));

const EnumClassificaRev = {};
EnumClassifica.forEach((v, i) => (EnumClassificaRev[v] = i));

export default function Girone({ data, nomi }) {
  // data: array di array delle partite
  // nomi: array di array dei nomi delle squadre
  const router = useRouter();
  return (
    <div className="space-y-2">
      <Title>{`AlpiVolley | ${router.query.categoria} - Girone ${router.query.girone}`}</Title>
      <h2 className="text-center font-bold">Partite</h2>
      <Partite data={data} nomi={nomi} />
      <h2 className="font-bold text-center">Classifica Girone</h2>
      <Classifica data={data} nomi={nomi} />
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
              <th key={v}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={i} className={cs(howManyPoints(v) && "opacity-50")}>
              {v.map((v, i) => (
                <td
                  className={cs(
                    getColor(v, nomi),
                    (i == EnumDataRev.Punteggio1 ||
                      i == EnumDataRev.Punteggio2) &&
                      "font-bold"
                  )}
                  key={EnumData[i]}
                >
                  {v}
                </td>
              ))}
              {v.length == 5 && (
                <>
                  <td className={cs(getColor(v, nomi), "font-bold")}>0</td>
                  <td className={cs(getColor(v, nomi), "font-bold")}>0</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
          <tr key={i} className={getColor(v[EnumClassificaRev.Nome], nomi)}>
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
        (_, i) => nomi[i][EnumNomiRev.Nome] == row[EnumDataRev.Squadra1]
      );
      const index2 = nomi.findIndex(
        (_, i) => nomi[i][EnumNomiRev.Nome] == row[EnumDataRev.Squadra2]
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
  const points1 = parseInt(row[EnumDataRev.Punteggio1]);
  const points2 = parseInt(row[EnumDataRev.Punteggio2]);
  if (isNaN(points1) || isNaN(points2)) return null;
  if (points2 < 19) return [3, 0];
  if (points1 < 19) return [0, 3];
  if (points1 > points2) return [2, 1];
  return [1, 2];
}

const queryGoogle = false;

export async function getStaticProps({ query }) {
  var values;
  if (queryGoogle && process.env.FETCH_GOOGLE) {
    const client = await getClient();
    values = (
      await client.spreadsheets.values.batchGet({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        ranges: getRanges(query),
      })
    ).data.valueRanges;
    fs.writeFileSync("data.json", JSON.stringify(values));
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

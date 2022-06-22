import { getClient, getRanges } from "lib/google";
import fs from "fs";
import { getColor } from "lib/colors";
import cs from "classnames";
import { useMemo } from "react";
import path from "path"

export default function Girone({ data, nomi }) {
  return (
    <div>
      <div>
        <table className="border mx-auto">
          <thead>
            <tr>
              <th>Orario</th>
              <th>Campo</th>
              <th>Squadra 1</th>
              <th>Squadra 2</th>
              <th>Arbitro</th>
              <th>Punti 1</th>
              <th>Punti 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v, ir) => (
              <tr key={ir}>
                {v.map((v, i) => (
                  <td className={cs(getColor(v, nomi, ir))} key={i}>
                    {v}
                  </td>
                ))}
                {v.length == 5 && (
                  <>
                    <td className={cs(getColor(v, nomi, ir))}>0</td>
                    <td className={cs(getColor(v, nomi, ir))}>0</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Classifica data={data} nomi={nomi} />
    </div>
  );
}

function Classifica({ data, nomi }) {
  const classifica = useClassifica(data, nomi);
  return (
    <table className="border mt-4 mx-auto">
      <thead>
        <tr>
          <th>Squadra</th>
          <th>Punti</th>
          <th>Vittorie</th>
        </tr>
      </thead>
      <tbody>
        {classifica.map((v, i) => (
          <tr key={i} className={getColor(v[0], nomi)}>
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
    for (const row of data) {
      const index1 = nomi.findIndex((_, i) => nomi[i][1] == row[2]);
      const index2 = nomi.findIndex((_, i) => nomi[i][1] == row[3]);
      const points = howManyPoints(row);
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
    punti.forEach((v, i) => {
      toBeSorted.push([nomi[i][1], v, vittorie[i]]);
    });
    return toBeSorted.sort((a, b) => {
      if (a[1] != b[1]) return b[1] - a[1];
      if (a[2] != b[2]) return b[2] - a[2];
      // TODO: aggiornare metodo calcolo classifica
      return 0;
    });
  }, [data, nomi]);
}

function howManyPoints(row) {
  const points1 = parseInt(row[5]);
  const points2 = parseInt(row[6]);
  if (isNaN(points1) || isNaN(points2)) return [0, 0];
  if (points1 == 21 && points2 < 19) return [3, 0];
  if (points2 == 21 && points1 < 19) return [0, 3];
  if (points1 < 21 && points2 < 21) return [0, 0];
  if (points1 > points2) return [2, 1];
  return [1, 2];
}

const queryGoogle = false;

export async function getServerSideProps({ query }) {
  var values;
  if (queryGoogle) {
    const client = await getClient();
    values = (
      await client.spreadsheets.values.batchGet({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        ranges: getRanges(query),
      })
    ).data.valueRanges;
    fs.writeFileSync("data.json", JSON.stringify(values));
  } else {
    values = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data.json")));
  }
  return {
    props: { data: values[0].values, nomi: values[1].values },
  };
}

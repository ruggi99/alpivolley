import { useRouter } from "next/router";

import { Disclosure } from "@headlessui/react";
import fs from "fs";
import path from "path";

import DataUpdate from "components/DataUpdate";
import Title from "components/Title";
import { gironi } from "lib/const";
import { EnumClassifica, transformEnum } from "lib/enums";
import { getClient } from "lib/google";
import { useClassificaAvulsa } from "lib/useClassifica";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

function Avulsa(pageProps) {
  const router = useRouter();
  const { data, update } = useUpdatedData(pageProps);
  const classifica = useClassificaAvulsa(data);
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-2">
      <Title>
        {firstLetterUp(router.query.categoria) + " - Classifica Avulsa"}
      </Title>
      <DataUpdate update={update} />
      <h2 className="text-center font-bold">Classifica Avulsa</h2>
      {classifica.map((v, i) => {
        const vFiltered = v.filter(Boolean);
        const ultimaPos = calcPosPrec(classifica, i);
        return (
          <Disclosure key={i} as="div" className="rounded-md border">
            <Disclosure.Button className="block w-full px-4 py-2">
              Classifica {ultimaPos + 1}° - {ultimaPos + vFiltered.length}°
            </Disclosure.Button>
            <Disclosure.Panel className="px-2">
              <Classifica classifica={vFiltered} />
            </Disclosure.Panel>
          </Disclosure>
        );
      })}
    </div>
  );
}

export default Avulsa;

function Classifica({ classifica }) {
  return (
    <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
      <thead>
        <tr>
          {EnumClassifica.map((v) => (
            <th key={v}>{transformEnum(v)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classifica.map((v, i) => (
          <tr key={i}>
            {v.map((v, i) => (
              <td key={i}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Somma le lunghezze delle righe fino all'indice i
function calcPosPrec(cl, i) {
  return cl.reduce(
    (acc, val, ind) => acc + (ind < i ? val.filter(Boolean).length : 0),
    0
  );
}

const queryGoogle = true;

export async function getStaticProps({ params }) {
  var values;
  if (queryGoogle && process.env.FETCH_GOOGLE) {
    const client = await getClient();
    values = (
      await client.spreadsheets.values.batchGet({
        spreadsheetId: process.env["GOOGLE_SHEET_ID_" + params.categoria],
        ranges: getRanges(params),
      })
    ).data.valueRanges;
    if (!process.env.NEXT_PUBLIC_VERCEL_ENV) {
      fs.writeFileSync(
        "public/data2.json",
        JSON.stringify(values, null, 2) + "\n"
      );
    }
  } else {
    values = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public/data2.json"))
    );
  }
  return {
    props: { data: values.map((v) => v.values), update: new Date().toJSON() },
    revalidate: 30,
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function getRanges({ categoria }) {
  return Array(gironi[categoria])
    .fill(0)
    .map((_, i) => "Partite_" + String.fromCharCode(65 + i));
}

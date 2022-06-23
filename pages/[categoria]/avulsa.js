import { Disclosure } from "@headlessui/react";
import fs from "fs";
import { useRouter } from "next/router";
import path from "path";

import Title from "components/Title";
import { EnumClassifica } from "lib/enums";
import { getClient } from "lib/google";
import useClassificaAvulsa from "lib/useClassificaAvulsa";

export default function Avulsa({ data }) {
  const router = useRouter();
  const classifica = useClassificaAvulsa(data);
  return (
    <div className="mx-auto max-w-xl space-y-2">
      <Title>{`${router.query.categoria} - Classifica Avulsa`}</Title>
      <h2 className="text-center font-bold">Classifica Avulsa</h2>
      {classifica.map((v, i) => (
        <Disclosure key={i} as="div" className="rounded-md border">
          <Disclosure.Button className="block w-full px-4 py-2">
            Classifica {i * v.length + 1}° - {(i + 1) * v.length}°
          </Disclosure.Button>
          <Disclosure.Panel className="px-2">
            <Classifica classifica={v} />
          </Disclosure.Panel>
        </Disclosure>
      ))}
    </div>
  );
}

function Classifica({ classifica }) {
  return (
    <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
      <thead>
        <tr>
          {EnumClassifica.map((v) => (
            <th key={v}>{v.replaceAll("_", " ")}</th>
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
    fs.writeFileSync("public/data2.json", JSON.stringify(values));
  } else {
    values = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public/data2.json"))
    );
  }
  return {
    props: { data: values.map((v) => v.values) },
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
  return ["Partite_A"];
}

import { useRouter } from "next/router";

import DataUpdate from "components/DataUpdate";
import Title from "components/Title";
import { calcClassificaAvulsa } from "lib/classificaAvulsa";
import { bgColors } from "lib/colors";
import { AIRTABLE_API_URL, revalidate } from "lib/const";
import { EnumClassificaAvulsa, transformEnum } from "lib/enums";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

export default function Avulsa(props) {
  const router = useRouter();
  const { data, update } = useUpdatedData(props);
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-2">
      <Title>
        {firstLetterUp(router.query.categoria) + " - Classifica Avulsa"}
      </Title>
      <DataUpdate update={update} />
      <h2 className="text-center font-bold">Classifica Avulsa</h2>
      <Classifica classifica={data} />
    </div>
  );
}

const fieldsToDisplay = [
  EnumClassificaAvulsa.Nome,
  EnumClassificaAvulsa.QuozientePunteggio,
  EnumClassificaAvulsa.QuozientePunti,
];

function Classifica({ classifica }) {
  return (
    <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
      <thead>
        <tr>
          {fieldsToDisplay.map((v) => (
            <th key={v}>{transformEnum(v)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classifica.map((c, i) => (
          <tr key={i} className={bgColors[i % bgColors.length]}>
            {fieldsToDisplay.map((v, k) => (
              <td key={k}>
                {typeof c[v] == "number"
                  ? c[v].toFixed(2)
                  : c[v]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export async function getStaticProps({ params }) {
  if (params.categoria != "men" && params.categoria != "women") {
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
    }`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const response = await res.json();
  const classifica = calcClassificaAvulsa(
    response.records.map((v) => v.fields)
  );
  return {
    props: {
      data: classifica,
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

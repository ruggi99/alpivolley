import { useRouter } from "next/router";

import DataUpdate from "components/DataUpdate";
import Title from "components/Title";
import { getRows } from "lib/baserow";
import { calcClassificaAvulsa } from "lib/classificaAvulsa";
import { bgColors } from "lib/colors";
import { CATEGORIE, REVALIDATE } from "lib/const";
import { EnumClassificaAvulsa, transformEnum } from "lib/enums";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

export default function Avulsa(props) {
  const router = useRouter();
  const { data, update } = useUpdatedData(props);
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2">
      <Title>{firstLetterUp(router.query.categoria) + " - Classifica Avulsa"}</Title>
      <DataUpdate update={update} />
      <h2 className="text-center font-bold">Classifica Avulsa</h2>
      <Classifica classifica={data} />
    </div>
  );
}

const fieldsToDisplay = [
  EnumClassificaAvulsa.Nome,
  EnumClassificaAvulsa.Punteggio,
  EnumClassificaAvulsa.Vittorie,
  EnumClassificaAvulsa.QuozientePunti,
];

function Classifica({ classifica }) {
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-separate border-spacing-x-0 border-spacing-y-2">
        <thead>
          <tr>
            <th>Pos.</th>
            {fieldsToDisplay.map((v) => (
              <th key={v}>{transformEnum(v)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classifica.map((c, i) => (
            <tr key={i} className={bgColors[i % bgColors.length]}>
              <td>{i + 1}</td>
              {fieldsToDisplay.map((v, k) => (
                <td key={k}>{typeof c[v] == "number" ? c[v].toFixed(2) : c[v] == null ? "--" : c[v]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  const response = await getRows(params.categoria, "Gironi");
  const classifica = calcClassificaAvulsa(response);
  return {
    props: {
      data: classifica,
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

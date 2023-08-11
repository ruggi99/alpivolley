import Referto from "components/Referto";
import { AIRTABLE_API_URL } from "lib/const";

export default function SingoloReferto(props) {
  if (props.empty) {
    return <Referto />;
  }
  return <Referto {...props.records[0]} categoria={props.categoria} />;
}

SingoloReferto.noLayout = true;

export async function getServerSideProps({ query: { cat, id } }) {
  if (id == "0") {
    return {
      props: {
        empty: true,
      },
    };
  }
  if (isNaN(parseInt(id)) || (cat != "MAS" && cat != "FEM" && cat != "AMA")) {
    return { notFound: true };
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];

  const res = await fetch(
    `${AIRTABLE_API_URL}/${baseID}/Gare ${cat}?filterByFormula=ID=${id}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const response = await res.json();
  return {
    props: { ...response, categoria: cat },
  };
}

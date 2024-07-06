import Referto from "components/Referto";
import { AIRTABLE_API_URL, CATEGORIE, DATA } from "lib/const";

export default function RefertoMultiplo(props) {
  return props.records.map((v) => (
    <Referto key={v.id} {...v} categoria={props.categoria} />
  ));
}

RefertoMultiplo.noLayout = true;

// Path validi a questo livello
const paths = CATEGORIE.map((c) =>
  Array(DATA[c].gironi)
    .fill(0)
    .map((_, i) => `/${c}/${String.fromCharCode(65 + i)}`),
).flat(2);

export async function getServerSideProps({ params }) {
  if (paths.indexOf(`/${params.categoria}/${params.girone}`) == -1) {
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
    `${AIRTABLE_API_URL}/${baseID}/Gare%20${params.categoria}?filterByFormula=Girone="${params.girone}"&view=Tutto`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );
  const response = await res.json();
  return {
    props: { ...response, categoria: params.categoria },
  };
}

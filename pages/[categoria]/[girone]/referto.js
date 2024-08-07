import Referto from "components/Referto";
import { getRows } from "lib/baserow";
import { GIRONI_PATHS } from "lib/const";

export default function RefertoMultiplo(props) {
  return props.data.map((v) => (
    <Referto key={v.id} data={v} categoria={props.categoria} />
  ));
}

RefertoMultiplo.noLayout = true;

export async function getServerSideProps({ params }) {
  if (GIRONI_PATHS.indexOf(`/${params.categoria}/${params.girone}`) == -1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const response = await getRows(params.categoria, "Gironi", params.girone);
  const data = response.results;
  return {
    props: { data, categoria: params.categoria },
  };
}

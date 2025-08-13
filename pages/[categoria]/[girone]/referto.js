import { useEffect } from "react";

import Referto from "components/Referto";
import { getRows } from "lib/baserow";
import { GIRONI_PATHS } from "lib/const";

export default function RefertoMultiplo(props) {
  useEffect(() => {
    print();
  }, []);
  return props.data.map((v) => <Referto key={v.id} data={v} categoria={props.categoria} />);
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
  return {
    props: { data: response, categoria: params.categoria },
  };
}

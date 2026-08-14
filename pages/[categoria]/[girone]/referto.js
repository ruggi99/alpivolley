import { useEffect } from "react";

import Referto from "components/Referto";
import { getRows } from "lib/baserow";
import { GIRONI_PATHS } from "lib/const";

export default function RefertoMultiplo(props) {
  useEffect(() => {
    print();
  }, []);
  return props.data
    .toSorted((a, b) => a.Campo - b.Campo)
    .map((v) => <Referto key={v.id} data={v} categoria={props.categoria} />);
}

RefertoMultiplo.noLayout = true;

export async function getServerSideProps({ params, query }) {
  if (GIRONI_PATHS.indexOf(`/${params.categoria}/${params.girone}`) == -1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  let response = null;
  if (query.turno) {
    parseInt(query.turno);
    response = await getRows(params.categoria, "Gironi", undefined, query.turno);
  } else {
    response = await getRows(params.categoria, "Gironi", params.girone);
  }
  return {
    props: { data: response, categoria: params.categoria },
  };
}

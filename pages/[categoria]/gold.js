import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import DataUpdate from "components/DataUpdate";
import { Edges, Nodes } from "components/Eliminazione";
import { NodeGrid } from "components/Eliminazione2";
import Title from "components/Title";
import { getRows } from "lib/baserow";
import { CATEGORIE, REVALIDATE } from "lib/const";
import { calculateEdgeCoords } from "lib/eliminazione";
import { calculateEdges, calculateNodes } from "lib/eliminazione2";
import useUpdatedData from "lib/useUpdatedData";
import { calculateMaxFase, firstLetterUp } from "lib/utils";

export default function Eliminazione(pageProps) {
  const { data, numero_fasi, update } = useUpdatedData(pageProps);
  // const [viewFase, setViewFase] = useState(numero_fasi);
  const [number, setNumber] = useState(0); // To update the state and recalculate the edges
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { query } = useRouter();
  useEffect(() => {
    const _nodes = calculateNodes(data, numero_fasi);
    // console.log(_nodes);
    setNodes(_nodes);
  }, [data, number, numero_fasi]);
  useEffect(() => {
    if (!nodes.length) return; // Da sistemare
    const _edges = calculateEdges(numero_fasi + 1);
    // console.log(_edges);
    setEdges(calculateEdgeCoords(_edges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
  return (
    <>
      <Title>{firstLetterUp(query.categoria) + " - Eliminazione"}</Title>
      <DataUpdate update={update} />
      <h3 className="text-center">Categoria {firstLetterUp(query.categoria)} - Gold</h3>
      <NodeGrid viewFase={numero_fasi}>
        <Nodes nodes={nodes} setNumber={setNumber} />
        <Edges edges={edges} />
      </NodeGrid>
    </>
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
  const response = await getRows(params.categoria, "Eliminazione", "Gold");
  // console.log(response);
  const NUMERO_FASI = calculateMaxFase(response);
  console.log(NUMERO_FASI);
  return {
    props: {
      data: response,
      numero_fasi: NUMERO_FASI,
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

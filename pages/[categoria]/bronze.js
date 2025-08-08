import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import DataUpdate from "components/DataUpdate";
import { Edges, NodeGrid,Nodes } from "components/Eliminazione";
import Title from "components/Title";
import { CATEGORIE, REVALIDATE } from "lib/const";
import {
  calculateEdgeCoords,
  calculateEdges,
  calculateFakeData,
  calculateNodes,
} from "lib/eliminazione";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";

const NUMERO_FASI = 4;

export default function Eliminazione(pageProps) {
  const { data, numero_fasi, update } = useUpdatedData(pageProps);
  const [viewFase, setViewFase] = useState(numero_fasi);
  const [number, setNumber] = useState(0); // To update the state and recalculate the edges
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { query } = useRouter();
  useEffect(() => {
    const _nodes = calculateNodes(data, viewFase + 1);
    // console.log(_nodes);
    setNodes(_nodes);
  }, [data, number, viewFase]);
  useEffect(() => {
    // console.log(data);
    // console.log(
    //   nodes,
    //   document.getElementById("viewport").children[0].children.length,
    // );
    if (!nodes.length) return; // Da sistemare
    const _edges = calculateEdges(viewFase + 1);
    // console.log(_edges);
    setEdges(calculateEdgeCoords(_edges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
  return (
    <>
      <Title>{firstLetterUp(query.categoria) + " - Eliminazione"}</Title>
      <DataUpdate update={update} />
      <h3 className="text-center">
        Categoria {firstLetterUp(query.categoria)} - Bronze
      </h3>
      <NodeGrid viewFase={viewFase}>
        <Nodes nodes={nodes} setNumber={setNumber} />
        <Edges edges={edges} />
      </NodeGrid>
      <input
        type="number"
        id="view_fasi"
        min="3"
        value={viewFase}
        onChange={(e) => setViewFase(parseInt(e.currentTarget.value))}
      />
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
  // const response = await getRows(params.categoria, "Eliminazione");
  // const response = [];
  // const classifica = calcClassificaAvulsa(response.results);
  return {
    props: {
      data: calculateFakeData(NUMERO_FASI),
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

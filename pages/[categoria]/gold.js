import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import DataUpdate from "components/DataUpdate";
import { Edges, Nodes } from "components/Eliminazione";
import { NodeGrid } from "components/Eliminazione2";
import Title from "components/Title";
import { CATEGORIE, REVALIDATE } from "lib/const";
import { calculateEdgeCoords } from "lib/eliminazione";
import { calculateEdges, calculateNodes } from "lib/eliminazione2";
import useUpdatedData from "lib/useUpdatedData";
import { firstLetterUp } from "lib/utils";
import { getRows } from "lib/baserow";

export default function Eliminazione(pageProps) {
  const { data, update } = useUpdatedData(pageProps);
  // const [viewFase, setViewFase] = useState(numero_fasi);
  const viewFase = 5;
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
  // console.log(data);
  // console.log(nodes);
  return (
    <>
      <Title>{firstLetterUp(query.categoria) + " - Eliminazione"}</Title>
      <DataUpdate update={update} />
      <h3 className="text-center">Categoria {firstLetterUp(query.categoria)} - Gold</h3>
      <NodeGrid viewFase={5}>
        <Nodes nodes={nodes} setNumber={setNumber} />
        <Edges edges={edges} />
      </NodeGrid>
      {/* <input
        type="number"
        id="view_fasi"
        min="3"
        value={viewFase}
        onChange={(e) => setViewFase(parseInt(e.currentTarget.value))}
      /> */}
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
  return {
    props: {
      data: response,
      // numero_fasi: NUMERO_FASI,
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

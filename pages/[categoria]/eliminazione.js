import "@xyflow/react/dist/style.css";

import { useEffect, useState } from "react";

import { CATEGORIE, REVALIDATE } from "lib/const";
import { calculateEdges, nodes } from "lib/eliminazione";

export default function Eliminazione(props) {
  // const viewportRef = useRef();
  const [edges, setEdges] = useState([]);
  useEffect(() => {
    const edges = calculateEdges();
    setEdges(edges);
  }, []);
  return (
    <div style={{ overflowX: "scroll" }} className="-m-4 p-4">
      <div
        // ref={viewportRef}
        id="viewport"
        className="relative w-min"
      >
        <div
          id="nodes"
          className="grid place-items-center gap-x-20 gap-y-2"
          style={{
            gridTemplateColumns: "repeat(11, auto)",
            gridTemplateRows: "repeat(17, auto)",
          }}
        >
          <Header />
          {nodes.map((v, i) => (
            <div
              key={i}
              id={v.id}
              style={v.style}
              className="whitespace-nowrap rounded-lg border p-4"
            >
              {v.data.fase}
            </div>
          ))}
        </div>
        <div id="edges" className="absolute inset-0 -z-10">
          <svg className="h-full" style={{ width: "100%" }}>
            {edges.map((v, i) => (
              <path
                className="fill-none stroke-2"
                key={i}
                id={v.id}
                d={v.path}
                style={v.style}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <div style={{ gridColumnStart: 1 }}>32simi</div>
      <div style={{ gridColumnStart: 2 }}>16simi</div>
      <div style={{ gridColumnStart: 3 }}>Ottavi</div>
      <div style={{ gridColumnStart: 4 }}>Quarti</div>
      <div style={{ gridColumnStart: 5 }}>Semifinali</div>
      <div style={{ gridColumnStart: 6 }}>Finali</div>
      <div style={{ gridColumnStart: 7 }}>Semifinali</div>
      <div style={{ gridColumnStart: 8 }}>Quarti</div>
      <div style={{ gridColumnStart: 9 }}>Ottavi</div>
      <div style={{ gridColumnStart: 10 }}>16simi</div>
      <div style={{ gridColumnStart: 11 }}>32simi</div>
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
  const response = [];
  // const classifica = calcClassificaAvulsa(response.results);
  return {
    props: {
      data: response,
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

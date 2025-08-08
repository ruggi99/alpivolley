import { calculateHeaders } from "lib/eliminazione2";

import { Node } from "./Eliminazione";

export function NodeGrid({ children, viewFase }) {
  return (
    <div className="-mx-4 overflow-x-scroll px-4">
      <div id="viewport" className="relative w-min">
        <div
          id="nodes"
          className="grid place-items-center gap-x-20 gap-y-2"
          style={{
            gridTemplateColumns:
              "repeat(" + (viewFase + 2 + (viewFase - 1) * 2) + ", auto)",
            gridTemplateRows: "repeat(" + (2 ** (viewFase - 1) + 1) + ", auto)",
          }}
        >
          <Header viewFase={viewFase} />
          {children}
        </div>
      </div>
    </div>
  );
}

function Header({ viewFase }) {
  const nodeHeaders = calculateHeaders(viewFase);
  return (
    <>
      {nodeHeaders.map((node, i) => (
        <Node key={i} node={node} />
      ))}
    </>
  );
}

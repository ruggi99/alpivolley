import cs from "classnames";

import { FASI } from "lib/const";

import { Node } from "./Eliminazione";

import { calculateHeaders } from "lib/eliminazione2";

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

function Header2() {
  const commonClassName =
    "border rounded-lg p-2 w-full text-center row-start-1";
  return (
    <>
      {FASI.map((v, i) => (
        <div
          key={i}
          style={{ gridColumnStart: i + 1 }}
          className={cs(commonClassName, "header-" + v.toLowerCase())}
        >
          {v}
        </div>
      ))}
      {FASI.slice(0, -1)
        .reverse()
        .map((v, i) => (
          <div
            key={i}
            style={{ gridColumnStart: i + 6 }}
            className={cs(commonClassName, "header-" + v.toLowerCase())}
          >
            {v + " R"}
          </div>
        ))}
    </>
  );
}

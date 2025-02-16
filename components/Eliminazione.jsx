import cs from "classnames";

const FASI = [
  "Trentaduesimi",
  "Sedicesimi",
  "Ottavi",
  "Quarti",
  "Semifinali",
  "Finali",
];

export default function Header() {
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
            style={{ gridColumnStart: i + 7 }}
            className={cs(commonClassName, "header-" + v.toLowerCase())}
          >
            {v}
          </div>
        ))}
    </>
  );
}

import cs from "classnames";

const placeHolder = "_".repeat(40);
const placeHolder2 = "_".repeat(5);

export default function Referto(props) {
  const { data: fields, empty } = props;
  return (
    <>
      <div
        style={{ width: "210mm", height: "297mm" }}
        className="referto relative bg-white"
      >
        <div
          className={cs("p-2 text-right text-sm", !fields["ID"] && "invisible")}
          style={{ height: "50px" }}
        >
          ID: {fields["ID"] || 0}
        </div>
        <div className="logo">
          <img
            style={{ width: "30%" }}
            className="mx-auto"
            src="/alpivolley.jpg"
          />
        </div>
        <h2 className="text-center text-primary-green">
          Il torneo green in Trentino
        </h2>

        <div className="mt-8 text-center">
          Categoria: <b>{props.categoria || placeHolder2}</b>, Campo:{" "}
          <b>{fields["Campo"] || placeHolder2}</b>, Girone:{" "}
          <b>{fields["Girone"]["value"] || placeHolder2}</b>
        </div>
        <div className="text-center">
          Arbitra:{" "}
          <b>{fields["Arbitro"] || (fields["ID"] && "STAFF") || placeHolder}</b>
        </div>
        <div>
          <table className="mx-auto mt-4 w-3/4">
            <thead>
              <tr>
                <th className="w-1/2">{fields["Squadra 1"] || placeHolder}</th>
                <th className="w-1/2">{fields["Squadra 2"] || placeHolder}</th>
              </tr>
            </thead>
            <tbody>
              {Array(23)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{i + 1}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">Vince: {placeHolder}</div>
        <div className="absolute bottom-0 w-full px-4 pb-2 text-center text-xs">
          <p>
            Vince la squadra che arriva a 21 con almeno due punti di vantaggio
            sull&apos;altra squadra, altrimenti vince la squadra che arriva per
            prima a 23.
          </p>
          <p>
            Si raccomanda di avere un comportamento corretto verso i compagni,
            avversari e persone addette all&apos;arbitraggio e all&apos;utilizzo
            del fair play.
          </p>
          <p>
            Sono assegnati 3 punti in caso di vittoria con scarto maggiore o
            uguale a 3 punti. Altrimenti 2 punti alla squadra vincente e 1 alla
            perdente.
          </p>
        </div>
      </div>
    </>
  );
}

const placeHolder = "_".repeat(40);

export default function Referto(props) {
  console.log(props);
  const fields = props.records?.[0].fields || {};
  return (
    <>
      <div
        style={{ width: "210mm", height: "297mm" }}
        className="referto relative bg-white"
      >
        <div className="p-2 text-right text-sm" style={{ height: "50px" }}>
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
          Arbitra:{" "}
          <b>
            {fields["Arbitro"]?.[0] || (fields["ID"] && "STAFF") || placeHolder}
          </b>
        </div>
        <div className="text-center">
          Categoria: <b>{props.categoria}</b>, Campo:{" "}
          <b>{fields["Campo"] || "_____"}</b>
        </div>
        <div>
          <table className="mx-auto mt-4 w-3/4">
            <thead>
              <tr>
                <th className="w-1/2">
                  {fields["Squadra 1"]?.[0] || placeHolder}
                </th>
                <th className="w-1/2">
                  {fields["Squadra 2"]?.[0] || placeHolder}
                </th>
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
        </div>
      </div>
      {process.env.NODE_ENV != "production" && (
        <pre className="noprint">{JSON.stringify(props, null, 2)}</pre>
      )}
    </>
  );
}

Referto.noLayout = true;

export async function getServerSideProps({ query: { cat, id } }) {
  if (id == "0") {
    return {
      props: {
        empty: true,
      },
    };
  }
  if (isNaN(parseInt(id)) || (cat != "M" && cat != "F")) {
    return { notFound: true };
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];

  const URL = "https://api.airtable.com/v0";

  const res = await fetch(
    `${URL}/${baseID}/Gare%20${cat}?filterByFormula=ID=${id}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const response = await res.json();
  return {
    props: { ...response, categoria: cat },
  };
}

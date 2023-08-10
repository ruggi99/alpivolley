import { useState } from "react";

import Button from "components/Button";
import { categorie_obj } from "lib/const";

export default function AppReferto(props) {
  console.log(props);
  const response = props.response;
  const [casa, setCasa] = useState(props.response.fields["Punti 1"] || 0);
  const [ospite, setOspite] = useState(props.response.fields["Punti 2"] || 0);
  const [submitting, setSubmitting] = useState(false);
  const [inverti, setInverti] = useState(false);
  async function updateCasa(up) {
    setSubmitting(true);
    const res = await fetch("/api/referto/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: response.id,
        categoria: categorie_obj[props.categoria],
        casa: casa + (up ? 1 : -1),
      }),
    }).catch(() => false);
    if (res !== false && res.ok) {
      setCasa(res.casa);
    }
    setSubmitting(false);
  }
  async function updateOspite(up) {
    setSubmitting(true);
    const res = await fetch("/api/referto/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoria: categorie_obj[props.categoria],
        id: response.id,
        ospite: ospite + (up ? 1 : -1),
      }),
    }).catch(() => false);
    if (res !== false && res.ok) {
      setOspite(res.ospite);
    }
    setSubmitting(false);
  }
  function invertiCampo() {
    return setInverti((v) => !v);
  }
  function submit() {
    fetch(`/api/referto/submit?id=${response.id}`);
  }

  const nomeCasa = props.response.fields["Squadra 1"][0];
  const nomeOspite = props.response.fields["Squadra 2"][0];
  if (response.fields.Status != "In corso") {
    return "Partita non in corso. Chiedi all'organizzazione";
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div
          className="w-full gap-4 space-y-4"
          style={{ order: inverti ? 1 : 0 }}
        >
          <div className="text-center text-xl font-bold">{nomeCasa}</div>
          <div className="text-center text-xl">{casa}</div>
          <Button onClick={() => updateCasa(true)} disabled={submitting}>
            +
          </Button>
          <Button onClick={() => updateCasa(false)} disabled={submitting}>
            -
          </Button>
        </div>
        <div className="w-full gap-4 space-y-4">
          <div className="text-center text-xl font-bold">{nomeOspite}</div>
          <div className="text-center text-xl">{ospite}</div>
          <Button onClick={() => updateOspite(true)} disabled={submitting}>
            +
          </Button>
          <Button onClick={() => updateOspite(false)} disabled={submitting}>
            -
          </Button>
        </div>
      </div>
      <Button onClick={invertiCampo}>Inverti campo</Button>
      <Button onClick={submit} disabled={submitting}>
        Invia partita
      </Button>
    </div>
  );
}

export async function getServerSideProps({ query: { categoria, id } }) {
  if (isNaN(parseInt(id)) || (categoria != "men" && categoria != "woman")) {
    return { notFound: true };
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];

  const URL = "https://api.airtable.com/v0";

  const res = await fetch(
    `${URL}/${baseID}/Gare%20${"M"}?filterByFormula=ID=${id}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const response = (await res.json()).records[0];
  return {
    props: { response, categoria },
  };
}

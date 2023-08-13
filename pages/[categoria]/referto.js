import { useState } from "react";

import Referto from "components/Referto";
import { AIRTABLE_API_URL, categorie, categorie_obj } from "lib/const";

export default function RefertoMultiplo(props) {
  const [squadra1, setSquadra1] = useState();
  const [squadra2, setSquadra2] = useState();
  const [arbitro, setArbitro] = useState();
  const fields = {
    "Squadra 1": [squadra1],
    "Squadra 2": [squadra2],
    Arbitro: [arbitro],
  };
  console.log(fields);
  return (
    <div className="flex">
      <div>
        <Referto categoria={props.categoria} fields={fields} />
      </div>
      <div className="noprint space-y-4">
        <SelectWithInput
          title="Squadra 1"
          value={squadra1}
          setValue={setSquadra1}
          squadre={props.records}
        />
        <SelectWithInput
          title="Squadra 2"
          value={squadra2}
          setValue={setSquadra2}
          squadre={props.records}
        />
        <SelectWithInput
          title="Arbitro"
          value={arbitro}
          setValue={setArbitro}
          squadre={props.records}
        />
      </div>
    </div>
  );
}

function SelectWithInput({ setValue, squadre, title, value }) {
  const [inputText, setInputText] = useState();
  function onChange(e) {
    setValue(e.currentTarget.selectedOptions[0].value);
  }
  function onChangeInput(e) {
    setInputText(e.currentTarget.value);
  }
  return (
    <div className="space-x-4 border p-4">
      <span className="">{title}</span>
      <input
        className="border"
        type="text"
        value={inputText}
        onChange={onChangeInput}
      />
      <select type="text" value={value} onChange={onChange}>
        <option value={undefined} disabled selected>
          --
        </option>
        {squadre
          .filter(
            (v) =>
              !inputText ||
              v.fields.Nome.toLowerCase().includes(inputText.toLowerCase())
          )
          .map((v, i) => (
            <option key={i} value={v.fields.Nome}>
              {v.fields.Nome}
            </option>
          ))}
      </select>
    </div>
  );
}

RefertoMultiplo.noLayout = true;

export async function getServerSideProps({ params }) {
  const cat = categorie_obj[params.categoria];
  if (!categorie.includes(params.categoria)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];
  const res = await fetch(
    `${AIRTABLE_API_URL}/${baseID}/Squadre ${cat}?view=SquadreE`,
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

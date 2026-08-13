import { useEffect, useState } from "react";

import Referto from "components/Referto";
import { BaseRow, getRows } from "lib/baserow";
import { CATEGORIE } from "lib/const";

export default function RefertoMultiplo(props) {
  const [squadra1, setSquadra1] = useState();
  const [squadra2, setSquadra2] = useState();
  const [arbitro, setArbitro] = useState();
  useEffect(() => {
    if (props.fields) print();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (props.fields) {
    const fields = {
      "Squadra 1": props.fields["Squadra 1"][0]["value"],
      "Squadra 2": props.fields["Squadra 2"][0]["value"],
      Arbitro: props.fields["Arbitro"][0]["value"],
      Campo: props.fields["Campo"],
      Girone: props.fields["Girone"]["value"],
      Orario: props.fields["Orario"],
    };
    return <Referto categoria={props.categoria} data={fields} />;
  }
  const fields = {
    "Squadra 1": squadra1,
    "Squadra 2": squadra2,
    Arbitro: arbitro,
  };
  return (
    <div className="flex">
      <div>
        <Referto categoria={props.categoria} data={fields} />
      </div>
      <div className="noprint space-y-4">
        <SelectWithInput title="Squadra 1" value={squadra1} setValue={setSquadra1} squadre={props.squadre} />
        <SelectWithInput title="Squadra 2" value={squadra2} setValue={setSquadra2} squadre={props.squadre} />
        <SelectWithInput title="Arbitro" value={arbitro} setValue={setArbitro} squadre={props.squadre} />
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
      <input className="border" type="text" value={inputText} onChange={onChangeInput} />
      <select type="text" value={value} onChange={onChange}>
        <option value={undefined} disabled selected>
          --
        </option>
        {squadre
          .filter((v) => !inputText || v.Nome.toLowerCase().includes(inputText.toLowerCase()))
          .map((v, i) => (
            <option key={i} value={v.Nome}>
              {v.Nome}
            </option>
          ))}
      </select>
    </div>
  );
}

RefertoMultiplo.noLayout = true;

export async function getServerSideProps({ params, query }) {
  if (!CATEGORIE.includes(params.categoria)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (query.id) {
    parseInt(query.id);
    if (!["Gironi", "Eliminazione"].includes(query.fase)) throw "fase not recognized";
    const BASEROW_TOKEN = process.env["BASEROW_TOKEN"];
    const baserow = new BaseRow(BASEROW_TOKEN);
    const response = await baserow.get_row(params.categoria, query.fase, query.id).then((v) => v.json());
    return {
      props: { fields: response, categoria: params.categoria },
    };
  } else {
    const response = await getRows(params.categoria, "Squadre");
    return {
      props: { squadre: response, categoria: params.categoria },
    };
  }
}

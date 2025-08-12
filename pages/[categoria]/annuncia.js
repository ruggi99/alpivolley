import { TextToSpeechClient } from "@google-cloud/text-to-speech";

import { BaseRow } from "lib/baserow";

const loginObj = {
  credentials: {
    client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
  },
  projectId: process.env.GCP_PROJECT_ID,
};

export default function TTS(props) {
  const { audioContent } = props;
  return (
    <>
      {/* <div>{audioContent}</div> */}
      <audio controls>
        <source src={audioContent} type="audio/mpeg" />
      </audio>
    </>
  );
}

export async function getServerSideProps({ query }) {
  // login to google
  const googleClient = new TextToSpeechClient(loginObj);
  // Get Baserow row data
  const baserow = new BaseRow(process.env.BASEROW_TOKEN);
  const row = await baserow.get_row(query.categoria, query.fase, query.id).then((v) => v.json());
  const squadra1 = row["Squadra 1"][0]["value"];
  const squadra2 = row["Squadra 2"][0]["value"];
  const arbitro = row["Arbitro"][0]["value"];
  // Generate TTS
  const obj = {
    input: {
      // ssml: `<speak> ${squadra1} <break time="300ms" /> contro <break time="300ms" /> ${squadra2} <break time="300ms" /> al campo ${row["Campo"]}. Arbitra ${arbitro} </speak>`,
      text: `${squadra1}. contro. ${squadra2}. al campo ${row["Campo"]}. Arbitra. ${arbitro}`,
    },
    voice: {
      languageCode: "it-IT",
      ssmlGender: "FEMALE",
      // name: "it-IT-Chirp3-HD-Charon",
      // voiceClone: {},
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      sampleRateHertz: 44000,
    },
  };
  const [response] = await googleClient.synthesizeSpeech(obj);
  return {
    props: {
      audioContent: "data:audio/mp3;base64," + response.audioContent.toString("base64"),
    },
  };
}

import { google } from "googleapis";

const accessScopes = ["https://www.googleapis.com/auth/spreadsheets"];

var googleSheet;
export async function getClient() {
  if (googleSheet) return googleSheet;
  console.log("creo un nuovo client");
  const client = new google.auth.JWT(
    process.env.GOOGLE_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    accessScopes,
    null
  );

  await client.authorize();
  const _googleSheet = google.sheets({ version: "v4", auth: client });
  googleSheet = _googleSheet;
  return _googleSheet;
}

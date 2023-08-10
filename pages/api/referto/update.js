/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function update(req, res) {
  if (req.method != "POST") {
    return res.status(400).end();
  }
  const body = req.body;
  if (body.id.length >= 20) {
    return res.status(400).end();
  }
  const baseID = process.env["BASE_ID"];
  const apiKey = process.env["APIKEY"];

  const URL = "https://api.airtable.com/v0";

  const dataToSend = {};
  if (body.casa) {
    dataToSend["Punti 1"] = body.casa;
  } else {
    dataToSend["Punti 2"] = body.ospite;
  }

  const resp = await fetch(
    `${URL}/${baseID}/Gare%20${body.categoria}/${body.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: dataToSend,
      }),
    }
  ).catch(() => false);
  console.log(resp.body);
  if (resp !== false && resp.status == 200) {
    return res.send(await resp.json());
  }
  return res.status(400).end();
}

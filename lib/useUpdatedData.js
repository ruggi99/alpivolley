import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { revalidate } from "lib/const";

export default function useUpdatedData(oldData) {
  const router = useRouter();
  const [newData, setNewData] = useState(false);
  const oldDate = oldData.update;
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VERCEL_ENV) return;
    if (!oldDate) return;
    if (new Date() - new Date(oldDate) < revalidate * 1000) return;
    async function fetchNewData() {
      const response = await fetch(
        `/_next/data/${window.__NEXT_DATA__.buildId}/${router.asPath}.json`
      );
      if (response.headers.get("x-vercel-cache") == "STALE") {
        console.error("Ricevuto dati STALE");
      }
      return await response.json();
    }
    // Stale data, must revalidate
    fetchNewData().then((d) => setNewData(d.pageProps));
  }, [oldDate, router.asPath]);
  return newData || oldData;
}

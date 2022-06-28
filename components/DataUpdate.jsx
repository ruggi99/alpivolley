import { useEffect, useState } from "react";

import cs from "classnames";

import { revalidate } from "lib/const";

export default function DataUpdate({ update }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return (
    <div
      className={cs(
        "mt-auto text-center",
        new Date() - new Date(update) > revalidate * 1000
          ? "text-red-500"
          : "text-green-500"
      )}
    >
      Ultimo aggiornamento dati:{" "}
      {isMounted && new Date(update).toLocaleTimeString()}
    </div>
  );
}

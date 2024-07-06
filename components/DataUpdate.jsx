import { useEffect, useState } from "react";

import cs from "classnames";

import { REVALIDATE } from "lib/const";

export default function DataUpdate({ update }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div>&nbsp;</div>;
  return (
    <div
      className={cs(
        "text-center",
        new Date() - new Date(update) > REVALIDATE * 1000
          ? "text-red-500"
          : "text-green-500",
      )}
    >
      Ultimo aggiornamento dati: {new Date(update).toLocaleTimeString()}
    </div>
  );
}

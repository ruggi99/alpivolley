import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Button from "components/Button";
import Title from "components/Title";

export default function Gironi() {
  const router = useRouter();
  useEffect(() => {
    // TODO: Limitare categorie del router
  }, [router]);
  return (
    <div className="grid h-screen place-content-center space-y-4">
      <Title>AlpiVolley | Categorie</Title>
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <Link
            key={i}
            href={`/${router.query.categoria}/${String.fromCharCode(65 + i)}`}
          >
            <a>
              <Button>Girone {String.fromCharCode(65 + i)}</Button>
            </a>
          </Link>
        ))}
    </div>
  );
}

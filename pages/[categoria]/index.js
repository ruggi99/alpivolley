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
    <div className="mx-auto grid place-content-center gap-4">
      <Title>AlpiVolley | Categorie</Title>
      <div className="space-y-4 rounded-md border p-4">
        <h2>Sabato</h2>
        <div className="grid grid-cols-2 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <ButtonWithLink key={i} href={String.fromCharCode(65 + i)}>
                Girone {String.fromCharCode(65 + i)}
              </ButtonWithLink>
            ))}
          <ButtonWithLink href="avulsa" className="col-span-2">
            Classifica Avulsa
          </ButtonWithLink>
        </div>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <h2>Domenica</h2>
        <div className="grid grid-cols-2 gap-4">
          <ButtonWithLink href="gold">GOLD</ButtonWithLink>
          <ButtonWithLink href="silver">SILVER</ButtonWithLink>
        </div>
      </div>
    </div>
  );
}

function ButtonWithLink({ children, href, ...props }) {
  const router = useRouter();
  return (
    <Link href={`/${router.query.categoria}/${href}`}>
      <a {...props}>
        <Button {...props}>{children}</Button>
      </a>
    </Link>
  );
}

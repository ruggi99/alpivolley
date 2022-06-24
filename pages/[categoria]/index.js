import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Button from "components/Button";
import { withNavigation } from "components/Navigation";
import Title from "components/Title";

function Gironi() {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    if (["men", "mixed", "women"].indexOf(router.query.categoria) == -1) {
      router.replace("/");
    }
  }, [router]);
  return (
    <div className="mx-auto grid place-content-center gap-4">
      <Title>Gironi</Title>
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

export default withNavigation(Gironi);

function ButtonWithLink({ children, href, ...props }) {
  const router = useRouter();
  return (
    <Link href={router.asPath + `/${href}`}>
      <a {...props}>
        <Button {...props}>{children}</Button>
      </a>
    </Link>
  );
}

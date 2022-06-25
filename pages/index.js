import Link from "next/link";

import Button from "components/Button";
import Title from "components/Title";

export default function Home() {
  return (
    <div className="m-auto grid h-full place-content-center">
      <Title>Categorie</Title>
      <div className="grid justify-items-stretch space-y-4">
        <h3>Seleziona una categoria</h3>
        <Link href="/men">
          <a>
            <Button>MEN</Button>
          </a>
        </Link>
        <Link href="/mixed">
          <a>
            <Button>MIXED</Button>
          </a>
        </Link>
        <Link href="/women">
          <a>
            <Button>WOMEN</Button>
          </a>
        </Link>
      </div>
    </div>
  );
}

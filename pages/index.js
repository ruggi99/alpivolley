import Head from "next/head";
import Link from "next/link";

import Button from "components/Button";

export default function Home() {
  return (
    <div className="mx-auto grid place-content-center">
      <div className="grid justify-items-stretch space-y-4">
        <Head>
          <title>AlpiVolley | Categorie</title>
        </Head>
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

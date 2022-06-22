import Head from "next/head";
import Link from "next/link";

import Button from "components/Button";

export default function Home() {
  return (
    <div className="grid h-screen place-content-center">
      <div className="grid max-h-96 max-w-sm space-y-4 justify-items-stretch">
        <Head>
          <title>AlpiVolley | Categorie</title>
        </Head>
        <Link href="/man">
          <a>
            <Button>MAN</Button>
          </a>
        </Link>
        <Link href="/mixed">
          <a>
            <Button>MIXED</Button>
          </a>
        </Link>
        <Link href="/woman">
          <a>
            <Button>WOMAN</Button>
          </a>
        </Link>
      </div>
    </div>
  );
}

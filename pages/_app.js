import { useCallback, useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import "@fontsource/roboto-mono";
import "@fontsource/ubuntu";

import Button from "components/Button";
import MyDialog from "components/Dialog";
import { Navigation } from "components/Navigation";
import { LOCALSTORAGEKEY } from "lib/const";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MetaTags />
      {Component.noLayout ? (
        <Component {...pageProps} />
      ) : (
        <>
          <Header />
          <CookieConsent />
          <Navigation className="ml-2 mt-2" />
          <div className="content relative flex-auto flex-shrink-0 space-y-4 p-4">
            <Component {...pageProps} />
          </div>
          <RoutesLoading />
          <Footer />
        </>
      )}
      {process.env.NODE_ENV !== "production" && (
        <div>
          <pre className="noprint">{JSON.stringify(pageProps, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
export default MyApp;

function MetaTags() {
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=0"
      />
    </Head>
  );
}

function Header() {
  return (
    <header className="flex-none bg-primary-green p-4 text-center text-3xl text-white">
      <div>
        <Link href="/">
          <a className="text-inherit">Torneo ALPIVOLLEY</a>
        </Link>
      </div>
    </header>
  );
}

function CookieConsent() {
  // TODO: Inserire modale per la prima visita del sito
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!localStorage[LOCALSTORAGEKEY]) setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
    localStorage.setItem(LOCALSTORAGEKEY, "true");
  }, []);
  return (
    <MyDialog show={open} onClose={closeDialog} title="Cookie Consent">
      <MyDialog.Body>
        <p>
          Questo sito non utilizza cookie di alcun genere, se non per ricordarsi
          di avertelo già detto.
        </p>
        <p>
          Utilizza però un servizio di analisi delle prestazioni dell&apos;app
          fornito e gestito da Vercel.
        </p>
        <p>
          Vengono raccolti dati anonimi ma non viene raccolto nessun dato
          personale
        </p>
        <p>Non viene visualizzata pubblicità di alcun genere</p>
      </MyDialog.Body>
      <MyDialog.Footer>
        <Button className="w-auto px-4 py-2" onClick={closeDialog}>
          Capito
        </Button>
      </MyDialog.Footer>
    </MyDialog>
  );
}

function RoutesLoading() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    function handleStart(url) {
      console.log("start", url);
      // if (/^\/.*\/[A-Z]{1}$/.test(url)) setShow(true);
    }
    function handleStop() {
      console.log("stop", arguments);
      setShow(false);
    }
    function handleError() {
      console.log("error", arguments);
      setShow(false);
    }
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleError);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  if (!show) return null;
  return (
    <div className="absolute inset-0 grid place-content-center bg-black/50">
      <style>{"html { overflow: hidden }"}</style>
      <div className="text-red-500">Loading</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex-none bg-primary-yellow px-8 py-4">
      <div className="text-center">
        Developed by{" "}
        <a href="https://github.com/ruggi99" target="_blank" rel="noopener">
          Ruggero Tomaselli
        </a>
      </div>
      <div className="text-center">
        Hosted on{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener">
          Vercel
        </a>
        .{" "}
        <a
          href="https://github.com/ruggi99/alpivolley"
          target="_blank"
          rel="noopener"
        >
          Source Code
        </a>{" "}
        on{" "}
        <a href="https://github.com" target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
      <div className="text-center">
        <Link href="/feedback">Lascia un Feedback</Link> -{" "}
        <a href="https://ko-fi.com/ruggio" target="_blank" rel="noopener">
          Sostienimi
        </a>
      </div>
    </footer>
  );
}

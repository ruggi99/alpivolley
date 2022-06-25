/* eslint-disable @next/next/no-page-custom-font */
import { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Navigation } from "components/Navigation";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MetaTags />
      <Header />
      <CookieConsent />
      <Navigation className="mt-2 ml-2" />
      <div className="content relative flex-auto flex-shrink-0 space-y-4 p-4">
        <Component {...pageProps} />
      </div>
      <RoutesLoading />
      <Footer />
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
  return null;
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
        <a href="https://github.com/ruggi99" target="_blank" rel="noreferrer">
          Ruggero Tomaselli
        </a>
      </div>
      <div className="text-center">
        Hosted on{" "}
        <a href="https://vercel.com" target="_blank" rel="noreferrer">
          Vercel
        </a>
        .{" "}
        <a
          href="https://github.com/ruggi99/alpivolley"
          target="_blank"
          rel="noreferrer"
        >
          Source Code
        </a>{" "}
        on{" "}
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <div className="text-center">
        Per problemi riguardanti il funzionamento del sito, rivolgersi al tavolo
        gare durante il torneo
      </div>
      <div className="text-center">
        <Link href="/feedback">Feedback</Link>
      </div>
    </footer>
  );
}

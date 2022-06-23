/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MetaTags />
      <Header />
      <CookieConsent />
      <div className="flex-1 content p-4">
        <Component {...pageProps} />
      </div>
      <Footer></Footer>
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
      ></meta>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto%20Mono:wght@400&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}

function Header() {
  return (
    <header className="flex-none p-4 text-center bg-primary-green text-white text-3xl">
      <div>Torneo ALPIVOLLEY</div>
      <div></div>
    </header>
  );
}

function CookieConsent() {
  return null;
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
    </footer>
  );
}

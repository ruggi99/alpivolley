import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div className="content p-4">
        <Component {...pageProps} />
      </div>
      <Footer></Footer>
    </>
  );
}

export default MyApp;

function Header() {
  return <div className="header p-4 text-center bg-green-500 text-white text-3xl">Torneo ALPIVOLLEY</div>
}

function Footer() {
  return (
    <div className="footer bg-gray-300 px-8 py-4">
      <div className="text-center">Developed by Ruggero Tomaselli</div>
      <div className="text-center">Hosted on Vercel. Source Code on GitHub</div>
      <div className="text-center">
        Per problemi riguardanti il funzionamento del sito, rivolgersi al tavolo
        gare durante il torneo
      </div>
    </div>
  );
}

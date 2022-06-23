import Head from "next/head";

export default function Title({ children }) {
  return (
    <Head>
      <title>{children}</title>
    </Head>
  );
}

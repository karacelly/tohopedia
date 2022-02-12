import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

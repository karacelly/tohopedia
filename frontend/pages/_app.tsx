import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloclient";
import { i18n } from "@lingui/core";
import { initTranslation } from "../utils";
import { useRouter } from "next/router";
import { useRef } from "react";
import { I18nProvider } from "@lingui/react";

initTranslation(i18n);

function MyApp({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  // const locale = router.locale || router.defaultLocale;
  // const firstRender = useRef(true);

  // if (pageProps.translation && firstRender.current) {
  //   i18n.load(locale, pageProps.translation);
  //   i18n.activate(locale);
  //   firstRender.current = false;
  // }

  return (
    // <I18nProvider i18n={i18n}>
    <ApolloProvider client={client}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
    // </I18nProvider>
  );
}

export default MyApp;

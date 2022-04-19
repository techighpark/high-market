import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import Script from "next/script";
import FloatingButton from "@components/floatingButton";

function MyApp({ Component, pageProps }: AppProps) {
  useUser();
  return (
    <SWRConfig
      value={{ fetcher: (url: string) => fetch(url).then(res => res.json()) }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;

import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Akshar&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

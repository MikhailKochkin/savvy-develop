// import React, {useEffect} from "react";
// import App, { Container } from "next/app";
// import { appWithTranslation } from "../i18n";
// // import { ApolloProvider } from "@apollo/client/react/components";
// import { ApolloProvider } from "@apollo/client";
// import Page from "../components/Page";
// import withData from "../lib/withData";

import React, { useEffect } from "react";
import App from "next/app";
import { ApolloProvider } from "@apollo/client";
import Page from "../components/Page";
import withData from "../lib/withData";
import { appWithTranslation } from "../i18n";

function MyApp({ Component, apollo, pageProps }) {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "d937200d-ad09-416f-87ba-4d441dcf12fd";
    (function () {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  });
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // this exposes the url params to the page component so we can use things like item ID in our queries
  pageProps.query = ctx.query;
  return { pageProps };
};

// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     let pageProps = {};
//     if (Component.getInitialProps) {
//       pageProps = await Component.getInitialProps(ctx);
//     }
//     // this exposes the query to the user
//     pageProps.query = ctx.query;
//     return { pageProps };
//   }
//   componentDidMount() {

//   }
//   render() {
//     const { Component, client, pageProps } = this.props;
//     return (
//       <ApolloProvider client={client}>
//         <Page>
//           <Component {...pageProps} />
//         </Page>
//       </ApolloProvider>
//     );
//   }
// }

export default appWithTranslation(withData(MyApp));

import "@/styles/globals.css";
import { store } from "../app/store.js";
import { Provider } from "react-redux";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Grocery</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

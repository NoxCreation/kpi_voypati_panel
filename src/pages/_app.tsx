import { UIProvider } from "@/components/ui/UIProvider";
import "@/styles/globals.css";
import '@/styles/nprogress.css';
import type { AppProps } from "next/app";
import NProgress from 'nprogress';
import { Router } from "next/router";
import { useEffect } from "react";

NProgress.configure({ showSpinner: false });

const handleRouteChangeStart = () => {
  NProgress.start();
};

const handleRouteChangeComplete = () => {
  NProgress.done();
};

const handleRouteChangeError = () => {
  NProgress.done();
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  return (
    <UIProvider>
      <Component {...pageProps} />
    </UIProvider>
  );
}

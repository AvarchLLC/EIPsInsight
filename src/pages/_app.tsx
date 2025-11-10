// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Providers } from "@/app/providers";
import DeploymentErrorBoundary from "@/components/DeploymentErrorBoundary";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <DeploymentErrorBoundary>
          <Component {...pageProps} />
        </DeploymentErrorBoundary>
      </Providers>
    </SessionProvider>
  );
}

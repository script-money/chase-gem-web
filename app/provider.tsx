"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { polygonZkEvmTestnet, localhost } from "wagmi/chains";

export const config = createConfig({
  chains: [localhost, polygonZkEvmTestnet],
  transports: {
    [localhost.id]: http(),
    [polygonZkEvmTestnet.id]: http(),
  },
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

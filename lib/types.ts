// export const Categories = ["Alpha", "DeFi"];
// export type CategoryNames = (typeof Categories)[number];

import { type Address } from "viem";

export interface GemInfoProps {
  user: Address;
  avatar: string;
  name: string;
  bio: string;
  url: string;
}

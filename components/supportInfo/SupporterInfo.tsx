/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useQuery } from "@tanstack/react-query";
import { type Address } from "viem";
import ens from "@/public/icon/ENS.svg";
import eth from "@/public/icon/ETH.svg";
import farcaster from "@/public/icon/farcaster.svg";
import lens from "@/public/icon/lens.svg";
import Image from "next/image";
import { Card } from "../ui/card";
import { useEffect } from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { chaseGemAbi } from "@/lib/abi";
import { chaseGemAddress } from "@/lib/address";

type Platform = "ENS" | "farcaster" | "lens";
type Link = "website" | "farcaster" | "lenster";

export interface Web3IdData {
  address: string;
  identity: string;
  platform: Platform | null;
  displayName: string;
  avatar: string | null;
  email: string | null;
  description: string | null;
  location: string | null;
  header: string | null;
  links: {
    [key in Link]?: {
      link: string;
      handle: string;
    };
  };
}

export interface SupporterInfoProps {
  address: Address;
  amount: string;
  displayName?: string;
  description?: string;
  platform?: string;
  links?: { [key in Link]?: { link: string; handle: string } };
  avatar?: string;
}

const SupporterInfo = ({
  address,
  amount,
  displayName,
  description,
  platform,
  links,
  avatar,
}: SupporterInfoProps) => {
  const { isLoading, error, data } = useQuery<Web3IdData[]>({
    queryKey: ["web3Id"],
    queryFn: () =>
      fetch(`
      https://api.web3.bio/profile/${address}`).then((res) => {
        console.log("API response", res);
        return res.json();
      }),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (data != undefined && data.length > 0) {
    const Web3IdData = data[data.length - 1]!;

    return (
      <Card className="inline-flex h-36 w-96 flex-col items-start justify-start gap-2 p-4">
        <div className="inline-flex shrink grow basis-0 items-center justify-start gap-2 self-stretch ">
          <div className="h-20 w-20 rounded-full bg-slate-300" />
          <div className="inline-flex w-28 flex-col items-start justify-start gap-2">
            <div className="font-sans text-lg font-semibold leading-tight text-black dark:font-light dark:text-white">
              {Web3IdData.identity}
            </div>
            <div className="font-sans text-xs font-semibold leading-tight text-slate-500">
              {Web3IdData.address.slice(0, 6) +
                "..." +
                Web3IdData.address.slice(-4)}
            </div>
            <div className="inline-flex items-start justify-center gap-2 self-stretch">
              <div className="shrink grow basis-0 self-stretch overflow-clip whitespace-nowrap font-sans text-xs font-semibold leading-tight text-black dark:font-light dark:text-white">
                Ξ {amount}
              </div>
            </div>
          </div>
          <div className="inline-flex flex-col items-start justify-center gap-2">
            {Web3IdData.links &&
              Object.entries(Web3IdData.links).map(([key, value], index) => {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center justify-start gap-2"
                  >
                    <Image
                      className="relative h-6 w-4"
                      src={
                        key == "website"
                          ? ens
                          : key == "farcaster"
                          ? farcaster
                          : lens
                      } // Replace with the appropriate image source based on the 'key'
                      alt={key}
                      width={16}
                      height={16}
                    />
                    <Link
                      href={value.link}
                      className="font-sans text-lg font-semibold leading-tight text-black dark:font-light dark:text-white"
                    >
                      {value.handle}
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </Card>
    );
  }
};

export default SupporterInfo;

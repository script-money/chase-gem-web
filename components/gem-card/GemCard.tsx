"use client";
import Image from "next/image";
import seedIcon from "@/public/icon/sprout.svg";
import testAvatar from "@/public/assets/testAvatar.jpg";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useCallback } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { chaseGemAbi } from "@/lib/abi";
import { chaseGemAddress } from "@/lib/address";
import { parseEther } from "viem";
import { useAtom, useSetAtom } from "jotai";
import { activeGemIdAtom, gemsInfoAtom } from "@/app/page";

interface GemCardProps {
  id: bigint;
  tagId: number;
  rank: number;
  isRevealed: boolean;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  link?: string;
  supportValue?: number;
}

interface GemInfoOnChain {
  user: string;
  avatar: string;
  name: string;
  bio: string;
  url: string;
}

const GemCard = ({ id, isRevealed, name, avatarUrl, bio }: GemCardProps) => {
  const [gemsInfo, setGemsInfo] = useAtom(gemsInfoAtom);
  const setActiveGemId = useSetAtom(activeGemIdAtom);

  const { writeContract: joinWrite } = useWriteContract();

  const { data } = useReadContract({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "idToSupportAmount",
    args: [id],
  });

  const { refetch: fetchGemInfo } = useReadContract({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "getGemById",
    args: [id],
    query: {
      enabled: false,
    },
  });

  const handleClickJoin = useCallback(() => {
    joinWrite(
      {
        abi: chaseGemAbi,
        address: chaseGemAddress,
        functionName: "join",
        args: [id],
        value: parseEther("0.000777777777777777"),
      },
      {
        onSuccess: () => {
          console.log(`success join: ${id}`);
          // refresh
          fetchGemInfo()
            .then((res) => {
              const newGemToBeAdd = {
                [id.toString()]: res.data as GemInfoOnChain,
              };
              const oldGems = JSON.parse(gemsInfo) as Record<
                string,
                GemInfoOnChain
              >;
              // Combine and save
              const updatedGemsInfo = {
                ...oldGems,
                ...newGemToBeAdd,
              };
              setGemsInfo(JSON.stringify(updatedGemsInfo));
            })
            .catch((err) => {
              console.log("fetchGemInfo err", err);
            });
        },
      },
    );
  }, [id, joinWrite, gemsInfo, setGemsInfo, fetchGemInfo]);

  const handleOpenBoard = () => {
    console.log(`Open Gem ${id} board`);
    setActiveGemId(id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡到外层 div
    e.stopPropagation();
  };

  return (
    <Card
      onClick={handleOpenBoard}
      className="inline-flex h-28 w-96 items-center justify-center gap-4 p-2"
    >
      <div className="font-sans text-lg font-semibold leading-tight">
        {Number(id)}
      </div>
      {isRevealed ? (
        <>
          <div className="h-20 w-20">
            <Image
              className="rounded-full"
              src={avatarUrl ?? testAvatar}
              alt="avatar"
              width={80}
              height={80}
            />
          </div>
          <div className="inline-flex w-52 flex-col items-start justify-start gap-1">
            <div className="font-sans text-sm font-semibold leading-tight text-slate-900 dark:font-light dark:text-white">
              @{name}
            </div>
            <div className="h-10 w-52 overflow-auto font-sans text-sm font-normal leading-tight text-slate-900 dark:font-light dark:text-white">
              {bio}
            </div>
            <div className="z-10 inline-flex w-56 items-center justify-start gap-1">
              <div className="relative h-4 w-4">
                <Image
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  src={seedIcon}
                  alt="support amount icon"
                  width={16}
                  height={16}
                />
              </div>
              <div className="w-56 font-sans text-xs font-medium leading-none text-slate-500">
                {data ? Number(data) : 0}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-20 w-20 animate-pulse rounded-full bg-slate-300" />
          <div
            onClick={handleCardClick}
            className="inline-flex h-20 w-52 flex-col items-center justify-center gap-1"
          >
            <Button variant="outline" size="lg" onClick={handleClickJoin}>
              Join To Reveal
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default GemCard;

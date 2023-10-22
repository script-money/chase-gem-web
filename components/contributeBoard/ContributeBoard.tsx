import React, { useCallback } from "react";
import { Card } from "../ui/card";
import { useReadContract, useWriteContract } from "wagmi";
import { chaseGemAbi } from "@/lib/abi";
import { chaseGemAddress } from "@/lib/address";
import { parseEther, type Address } from "viem";
import { Button } from "../ui/button";
import { atom, useAtom, useSetAtom } from "jotai";
import { Input } from "../ui/input";
import { activeGemIdAtom } from "@/app/page";

interface SupportInfo {
  supporter: Address;
  amount: bigint;
  gemId: bigint;
}

interface ContributeBoardProps {
  gemId: bigint;
}

const amountAtom = atom<number>(0.000777777777777777);

const ContributeBoard = ({ gemId }: ContributeBoardProps) => {
  const [amount, setAmount] = useAtom(amountAtom);
  const setActiveGemId = useSetAtom(activeGemIdAtom);

  const { data: supportInfos } = useReadContract({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "getSupportersByGemId",
    args: [gemId],
  });

  const { writeContract: supportWrite } = useWriteContract();

  const handleSupport = useCallback(() => {
    supportWrite(
      {
        abi: chaseGemAbi,
        address: chaseGemAddress,
        functionName: "support",
        args: [gemId],
        value: parseEther(amount.toString()), // Fix 1: Convert amount to string
      },
      {
        onSuccess: () => {
          console.log(`success support: ${gemId} ${amount}`);
          // refresh
        },
        onSettled: () => {
          console.log(`settled support: ${gemId} ${amount}`);
        },
      },
    );
  }, [gemId, amount, supportWrite]);

  const handleClose = () => {
    setActiveGemId(null);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡到外层 div
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 px-4"
    >
      <Card
        onClick={handleCardClick}
        className="max-w-480 flex h-4/5 w-full flex-col bg-opacity-100 p-4 lg:w-1/3"
      >
        <div className="flex flex-grow items-center justify-center text-black dark:font-light dark:text-white">
          {supportInfos && supportInfos.length > 0
            ? (supportInfos as SupportInfo[]).map(
                (supportInfo: SupportInfo, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center justify-start">
                        <div className="font-sans text-lg font-semibold leading-tight">
                          {supportInfo.supporter}
                        </div>
                        <div className="font-sans text-lg font-semibold leading-tight">
                          {Number(supportInfo.amount)}
                        </div>
                      </div>
                    </div>
                  );
                },
              )
            : "No supporter yet, be the first"}
        </div>
        <div className="flex h-40 items-end justify-end gap-2">
          <Input
            className="w-60"
            type="number"
            placeholder="ETH"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          ></Input>
          <Button variant="outline" onClick={handleSupport}>
            support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContributeBoard;

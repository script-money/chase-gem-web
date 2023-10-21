"use client";
import { useEffect, useRef } from "react";
import {
  useAccount,
  useConnect,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { useDisconnect, useReconnect } from "wagmi";
import { ModeToggle } from "@/components/ModeToggle";
import Category from "@/components/category/Category";
import { Button } from "@/components/ui/button";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { chaseGemAbi } from "@/lib/abi";
import { chaseGemAddress } from "@/lib/address";
import { atomWithWebStorage } from "@/lib/utils";

const latestTagAtom = atomWithWebStorage("latestTag", "0");
const tagsAtom = atomWithWebStorage("tags", JSON.stringify([]));
const tagArrayAtom = atom<string[]>((get) => JSON.parse(get(tagsAtom)));
const readTagsArgsAtom = atom((get) =>
  Array.from(
    { length: Number(get(latestTagAtom)) },
    (_, index) => index + 1,
  ).map((tagId) => {
    return {
      abi: chaseGemAbi,
      address: chaseGemAddress,
      functionName: "tagIdToTag",
      args: [tagId],
    };
  }),
);

export default function Page() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { reconnect } = useReconnect();

  const [latestTag, setLatestTag] = useAtom(latestTagAtom);
  const readTagsArgs = useAtomValue(readTagsArgsAtom);
  const setTags = useSetAtom(tagsAtom);
  const tags = useAtomValue(tagArrayAtom);

  const { refetch: fetchLatestTag } = useReadContract({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "latestTag",
    query: {
      enabled: false,
    },
  });

  const { refetch: fetchTags } = useReadContracts({
    contracts: readTagsArgs,
    query: {
      enabled: false,
    },
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchAndSetLatestTag = async () => {
      if (!isFirstRender.current) return;
      isFirstRender.current = false;
      console.log("Start ChaseGem");
      reconnect();

      // get latest tag index
      if (latestTag === "0") {
        const result = await fetchLatestTag();
        if (result && result.data) {
          console.log("fetchLatestTag", result.data);
          setLatestTag(result.data.toString());
        }
      } else {
        console.log("latestTag from storage", latestTag);
      }

      // get tags
      const readArgs = Array.from(
        { length: Number(latestTag) },
        (_, index) => index + 1,
      ).map((tagId) => {
        return {
          abi: chaseGemAbi,
          address: chaseGemAddress,
          functionName: "tagIdToTag",
          args: [tagId],
        };
      });

      const fetchTagsResult = await fetchTags();
      setTags(
        JSON.stringify(
          fetchTagsResult.data
            ?.filter((data) => data.status == "success")
            .map((data) => data.result),
        ),
      );
    };

    fetchAndSetLatestTag();
  }, []);

  return (
    <>
      <div className="relative mt-4 flex min-h-screen w-full flex-col items-center justify-start gap-[12px] overflow-hidden p-3 lg:mt-16">
        <div className="w-full lg:w-[1200px]">
          <div className="flex items-center justify-between">
            <div className="h-12 self-start font-mono text-4xl font-medium leading-normal text-black dark:font-light dark:text-white">
              {"ChaseGem(💎,🏃)"}
            </div>
            <div className="flex items-center gap-x-4">
              <ModeToggle />
              <Button
                variant="outline"
                onClick={() =>
                  !address ? connect({ connector: injected() }) : disconnect()
                }
              >
                {address ? `${address?.slice(0, 6)}...` : "Connect"}
              </Button>
            </div>
          </div>
          {tags.map((category, index) => {
            return (
              <Category tag={category} defaultOpen={index == 0} key={index} />
            );
          })}
        </div>
      </div>
    </>
  );
}

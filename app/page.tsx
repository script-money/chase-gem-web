"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useConnect,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { useDisconnect } from "wagmi";
import { ModeToggle } from "@/components/ModeToggle";
import Category from "@/components/category/Category";
import { Button } from "@/components/ui/button";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { chaseGemAbi } from "@/lib/abi";
import { chaseGemAddress } from "@/lib/address";
import { RefreshCcw } from "lucide-react";
import { atomWithWebStorage } from "@/lib/utils";

const latestTagAtom = atomWithWebStorage("latestTag", "0");
const latestGemIdAtom = atomWithWebStorage("latestGemId", "0");
const tagsAtom = atomWithWebStorage("tags", JSON.stringify([]));
const tagArrayAtom = atom<string[]>(
  (get) => JSON.parse(get(tagsAtom)) as string[],
);
const readTagsArgsAtom = atom((get) =>
  Array.from(
    { length: Number(get(latestTagAtom)) },
    (_, index) => index + 1,
  ).map((tagId) => ({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "tagIdToTag",
    args: [tagId],
  })),
);
const readGemIdsArgsAtom = atom((get) => {
  const latestTag = Number(get(latestTagAtom));
  return Array.from({ length: latestTag }, (_, index) => index + 1).map(
    (tagId) => ({
      abi: chaseGemAbi,
      address: chaseGemAddress,
      functionName: "getGemIdsByTag",
      args: [tagId],
    }),
  );
});

const tagIdToGemIdsAtom = atom<Record<string, bigint[]>>({});

export default function Page() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const [latestTag, setLatestTag] = useAtom(latestTagAtom);
  const [latestGemId, setLatestGemId] = useAtom(latestGemIdAtom);
  const readGemIdsArgs = useAtomValue(readGemIdsArgsAtom);
  const readTagsArgs = useAtomValue(readTagsArgsAtom);
  const setTags = useSetAtom(tagsAtom);
  const tags = useAtomValue(tagArrayAtom);
  const [tagIdToGemIds, setTagIdToGemIds] = useAtom(tagIdToGemIdsAtom);

  const [refreshTags, setRefreshTags] = useState(false);
  const [refreshTGemIds, setRefreshTGemIds] = useState(false);

  const { refetch: fetchLatestTagAndLatestGemId } = useReadContracts({
    contracts: [
      {
        abi: chaseGemAbi,
        address: chaseGemAddress,
        functionName: "latestTag",
      },
      {
        abi: chaseGemAbi,
        address: chaseGemAddress,
        functionName: "gemIdIndex",
      },
    ],
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

  const { refetch: fetchGemIds } = useReadContracts({
    contracts: readGemIdsArgs,
    query: {
      enabled: false,
    },
  });

  const { refetch: getBalance } = useReadContract({
    abi: chaseGemAbi,
    address: chaseGemAddress,
    functionName: "getUserGemBalances",
    args: [
      address!,
      Array.from({ length: Number(latestGemId) }, (_, i) => BigInt(i + 1)),
    ],
    query: {
      enabled: false,
    },
  });

  // helper functions
  const fetchAndSetTags = useCallback(async () => {
    const fetchTagsResult = await fetchTags();
    setTags(
      JSON.stringify(
        fetchTagsResult.data
          ?.filter((data) => data.status == "success")
          .map((data) => data.result),
      ),
    );
  }, [fetchTags, setTags]);

  const fetchAndSetGemIds = useCallback(async () => {
    const result = await fetchGemIds();
    if (result.data) {
      const tagIdToGemIds: Record<string, bigint[]> = {};
      result.data.forEach(({ result, status }, index) => {
        if (status == "success") {
          tagIdToGemIds[index + 1] = result as unknown as bigint[];
        }
      });
      setTagIdToGemIds(tagIdToGemIds);
      console.log("tagIdToGemIds", tagIdToGemIds);
    }
  }, [fetchGemIds, setTagIdToGemIds]);

  const fetchAndSetLatestTagAndLatestGemId = useCallback(async () => {
    const result = await fetchLatestTagAndLatestGemId();
    if (result.data?.[0].result && result.data[1].result) {
      setLatestTag(result.data[0].result.toString());
      setLatestGemId(result.data[1].result.toString());
    }
    return result;
  }, [fetchLatestTagAndLatestGemId, setLatestGemId, setLatestTag]);

  // first open app logic
  const isFirstRender = useRef(true);
  useEffect(() => {
    const firstOpenQuery = async () => {
      if (!isFirstRender.current) return;
      isFirstRender.current = false;
      console.log("Start ChaseGem");

      // get latest tag index
      if (latestTag === "0" || latestGemId === "0") {
        await fetchAndSetLatestTagAndLatestGemId();
      } else {
        console.log("latestTag from storage", latestTag);
        console.log("latestGemId from storage", latestGemId);
      }

      // get tags
      await fetchAndSetTags();

      // get all gem ids by tag, it's will be Record<tagId, GemIds[]>
      await fetchAndSetGemIds();
    };

    firstOpenQuery().catch((e) => {
      console.warn("firstOpenQuery error", e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login logic
  useEffect(() => {
    const firstLoginQuery = async () => {
      if (!address) return;
      //  TODO: move logics to user login, get nft ids user has, and requery gem data by user nft ids
      const userBalaces: number[] = [];
      if (address) {
        // get user balance ids
        const result = await getBalance();
        if (result) {
          console.log("getBalance", result);
        }
      } else {
        console.log("Not login");
      }
    };

    firstLoginQuery().catch((e) => {
      console.warn("firstLoginQuery error", e);
    });
  }, [address, getBalance]);

  // fetch tags
  useEffect(() => {
    if (!refreshTags) return;
    const fetchTagsData = async () => {
      await fetchAndSetTags();
    };
    fetchTagsData().catch((e) => {
      console.warn("fetchTagsData error", e);
    });
  }, [refreshTags, fetchTags, fetchAndSetTags]);

  // fetch gem ids
  useEffect(() => {
    if (!refreshTGemIds) return;
    const fetchGemIdsData = async () => {
      await fetchAndSetGemIds();
    };
    fetchGemIdsData().catch((e) => {
      console.warn("fetchGemIdsData error", e);
    });
  }, [refreshTGemIds, fetchGemIds, fetchAndSetGemIds]);

  // refresh all data
  const handleRefresh = useCallback(async () => {
    console.log("Clean storage and refetch data");
    setTags(undefined);
    await fetchAndSetLatestTagAndLatestGemId();
    setRefreshTags(true);
    setRefreshTGemIds(true);
  }, [fetchAndSetLatestTagAndLatestGemId, setTags]);

  // connect wallet
  const handleConnect = useCallback(() => {
    address ? disconnect() : connect({ connector: injected() });
  }, [address, connect, disconnect]);

  return (
    <>
      <div className="relative mt-4 flex min-h-screen w-full flex-col items-center justify-start gap-[12px] overflow-hidden p-3 lg:mt-16">
        <div className="w-full lg:w-[1200px]">
          <div className="flex items-center justify-between">
            <div className="h-12 self-start font-mono text-4xl font-medium leading-normal text-black dark:font-light dark:text-white">
              {"ChaseGem(💎,🏃)"}
            </div>
            <div className="flex items-center gap-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={void handleRefresh()}
              >
                <RefreshCcw className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
              <ModeToggle />
              <Button variant="outline" onClick={handleConnect}>
                {address ? `${address?.slice(0, 6)}...` : "Connect"}
              </Button>
            </div>
          </div>
          {tags.map((category, index) => {
            return (
              <Category
                key={index}
                tagId={index + 1}
                tag={category}
                defaultOpen={index == 0}
                gemIds={tagIdToGemIds[index + 1]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

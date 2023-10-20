import { ModeToggle } from "@/components/ModeToggle";
import Category from "@/components/category/Category";
import WalletConnector from "@/components/wallet-connector/WalletConnector";
import { Categories } from "@/lib/types";

export default function Page() {
  return (
    <div className="relative mt-4 flex min-h-screen w-full flex-col items-center justify-start gap-[12px] overflow-hidden p-3 lg:mt-16">
      <div className="w-full lg:w-[1200px]">
        <div className="flex items-center justify-between">
          <div className="h-12 self-start font-mono text-4xl font-medium leading-normal text-black dark:font-light dark:text-white">
            {"ChaseGem(💎,🏃)"}
          </div>
          <div className="flex items-center gap-x-4">
            <ModeToggle />
            <WalletConnector />
          </div>
        </div>
        {Categories.map((category, index) => {
          return <Category tag={category} defaultOpen={index == 0} />;
        })}
      </div>
    </div>
  );
}

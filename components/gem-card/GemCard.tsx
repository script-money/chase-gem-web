import Image from "next/image";
import seedIcon from "@/public/icon/sprout.svg";
import testAvatar from "@/public/assets/testAvatar.jpg";

interface GemCardProps {
  index: number;
  isRevealed: boolean;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  link?: string;
  supportValue?: number;
}

const GemCard = ({
  index,
  isRevealed,
  name,
  avatarUrl,
  bio,
  link,
  supportValue,
}: GemCardProps) => {
  return (
    <div className="inline-flex h-28 w-96 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white p-4 shadow">
      <div className="font-sans text-lg font-semibold leading-tight text-black">
        {index}
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
            <div className="font-sans text-sm font-semibold leading-tight text-slate-900">
              @{name}
            </div>
            <div className="h-10 w-56 font-sans text-sm font-normal leading-tight text-slate-900">
              {bio}
            </div>
            <div className="inline-flex w-56 items-center justify-start gap-1">
              <div className="relative h-4 w-4">
                <Image
                  src={seedIcon}
                  alt="support amount icon"
                  width={16}
                  height={16}
                />
              </div>
              <div className="w-56 font-sans text-xs font-medium leading-none text-slate-500">
                ${supportValue}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-20 w-20 animate-pulse rounded-full bg-slate-300" />
          <div className="inline-flex h-20 w-52 flex-col items-center justify-center gap-1">
            <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-slate-900 px-4 py-2">
              <div className="font-sans text-sm font-medium leading-normal text-white">
                Join
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GemCard;
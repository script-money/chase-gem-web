import GemCard from "@/components/gem-card/GemCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type GemInfoProps } from "@/lib/types";

interface CategoryProps {
  tagId: number;
  tag: string;
  defaultOpen?: boolean;
  gemIds?: bigint[];
  data?: Record<string, GemInfoProps>;
}

const Category = ({ tagId, tag, defaultOpen, gemIds, data }: CategoryProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultOpen ? "item-1" : undefined}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="pr-2 text-3xl dark:font-light dark:text-white">
          {tag}
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {gemIds &&
              gemIds.length > 0 &&
              gemIds.map((gemId, index) => {
                const gemInfo = data?.[gemId.toString()];
                const isRevealed = !!gemInfo;
                return (
                  <GemCard
                    key={index}
                    id={gemId}
                    tagId={tagId}
                    rank={index + 1}
                    isRevealed={isRevealed}
                    name={gemInfo?.name}
                    avatarUrl={gemInfo?.avatar}
                    bio={gemInfo?.bio}
                    link={gemInfo?.url}
                  />
                );
              })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Category;

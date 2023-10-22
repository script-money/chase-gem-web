import GemCard from "@/components/gem-card/GemCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CategoryProps {
  tagId: number;
  tag: string;
  defaultOpen?: boolean;
  gemIds?: BigInt[];
}

const Category = ({ tagId, tag, defaultOpen, gemIds }: CategoryProps) => {
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
                return (
                  <GemCard
                    key={index}
                    tagId={tagId}
                    rank={index + 1}
                    isRevealed={false}
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

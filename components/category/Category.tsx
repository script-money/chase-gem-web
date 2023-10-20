import GemCard from "@/components/gem-card/GemCard";
import { CategoryNames } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CategoryProps {
  tag: CategoryNames;
  defaultOpen?: boolean;
}

const Category = ({ tag, defaultOpen }: CategoryProps) => {
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
            <GemCard index={1} isRevealed={false} />
            <GemCard index={2} isRevealed={false} />
            <GemCard index={3} isRevealed={false} />
            <GemCard index={4} isRevealed={false} />
            <GemCard index={5} isRevealed={false} />
            <GemCard index={6} isRevealed={false} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Category;

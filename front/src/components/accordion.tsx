import { FC, PropsWithChildren } from "react";
import { Accordion as FlowbiteAccordion } from "flowbite-react";

interface AccordionProps {
  title: string;
}

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({
  children,
  title,
}) => {
  return (
    <FlowbiteAccordion collapseAll>
      <FlowbiteAccordion.Panel>
        <FlowbiteAccordion.Title>{title}</FlowbiteAccordion.Title>
        <FlowbiteAccordion.Content>{children}</FlowbiteAccordion.Content>
      </FlowbiteAccordion.Panel>
    </FlowbiteAccordion>
  );
};

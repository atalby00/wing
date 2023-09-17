import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { FC, PropsWithChildren, useCallback } from "react";

interface SidebarSectionProps {
  onClick: (index: number) => void;
  sectionNumber: number;
  selectedPalette: number;
}

export const SidebarSection: FC<PropsWithChildren<SidebarSectionProps>> = ({
  children,
  onClick,
  sectionNumber,
  selectedPalette,
}) => {
  const handleSectionClick = useCallback(() => {
    onClick(sectionNumber);
  }, [onClick, sectionNumber]);

  return (
    <FlowbiteSidebar.Item
      key={sectionNumber}
      className={`cursor-pointer hover:bg-gray-200 ${
        sectionNumber === selectedPalette ? "bg-gray-200" : ""
      }`}
      onClick={handleSectionClick}
    >
      {children}
    </FlowbiteSidebar.Item>
  );
};

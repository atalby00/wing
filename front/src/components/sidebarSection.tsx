import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { FC, PropsWithChildren, useCallback } from "react";

interface SidebarSectionProps {
  onClick: (index: number) => void;
  sectionNumber: number;
}

export const SidebarSection: FC<PropsWithChildren<SidebarSectionProps>> = ({
  children,
  onClick,
  sectionNumber,
}) => {
  const handleSectionClick = useCallback(() => {
    onClick(sectionNumber);
  }, []);

  return (
    <FlowbiteSidebar.Item
      key={sectionNumber}
      className="cursor-pointer"
      onClick={handleSectionClick}
    >
      {children}
    </FlowbiteSidebar.Item>
  );
};

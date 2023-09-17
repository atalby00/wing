import { FC, PropsWithChildren } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";

interface SidebarProps {}

export const Sidebar: FC<PropsWithChildren<SidebarProps>> = ({ children }) => {
  return (
    <FlowbiteSidebar aria-label="Sidebar">
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>{children}</FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

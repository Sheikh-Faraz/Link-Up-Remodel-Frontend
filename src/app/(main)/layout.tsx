"use client"

import SidebarLocked from "@/app/blocks/sidebar-lock";
import HorizontalSidebarLocked from "../blocks/Horizontal-sidebar-lock";  
import { useChat } from "../store/Chatinfo";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { hsToggle } = useChat();

  return (
    <div className="flex flex-col lg:flex-row max-lg:overflow-hidden">
      
      <div className="hidden lg:block">
        <SidebarLocked />
      </div>

      <main className="flex-1">{children}</main>

      {!hsToggle && 
        <div className="block lg:hidden">
          <HorizontalSidebarLocked />
        </div>
      }

    </div>
  );
}

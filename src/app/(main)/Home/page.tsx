"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatContainer from "@/app/blocks/ChatContainer";
import NoChatSelected from "@/app/blocks/NoChatSelected";
import { useChat } from "@/app/store/Chatinfo";
import { useEffect } from "react";
import { useGlobalLoading } from "@/app/store/LoadingContext";

export default function HomePage() {
  const { selectedUser, authUser, checkAuth, previewSidebar, isChatOpen, chatOpen } = useChat();
  const { setIsLoading } = useGlobalLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    checkAuth();
  }, [authUser, checkAuth]);

  // Open chat when user is selected
  useEffect(() => {
    if (selectedUser) {
      chatOpen(true)
      previewSidebar(true);
    };
  }, [selectedUser]);

  return (
    <div className="flex bg-sidebar w-full">
      <SidebarProvider>
        {/* Sidebar */}
    
        <div className={`w-full my-4 lg:w-fit ${isChatOpen ? "hidden lg:block" : "block"}`}>
          <AppSidebar />
        </div>

        {/* Chat Area */}
        <div className={`my-4 mr-2 flex-1 overflow-hidden ${!isChatOpen ? "hidden md:block" : "block"}`}>
          <div className="h-full ">
            {/* Chat content */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

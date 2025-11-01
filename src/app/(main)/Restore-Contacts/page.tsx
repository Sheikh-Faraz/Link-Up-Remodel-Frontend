"use client"

import RestoreSidebar  from "@/app/blocks/Restore-Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import RestoreChatContainer from "@/app/blocks/Restore-Chat-Container";
import NoChatSelected from '../../blocks/NoChatSelected';
import { useChat } from "@/app/store/Chatinfo";
import { useEffect } from "react";
import { useGlobalLoading } from "@/app/store/LoadingContext";

export default function RestoreContactPage () {
  const { selectedUser, previewSidebar, isChatOpen, chatOpen } = useChat();
  const { setIsLoading } = useGlobalLoading();

  // Open chat when user is selected
  useEffect(() => {
    if (selectedUser) { 
      chatOpen(true)
      previewSidebar(true);
    };
  }, [selectedUser]);
        
  useEffect(() =>{
    setIsLoading(false);
  }, [])
  // }, [setIsLoading])
  
    return (
        <div className="flex bg-[hsl(60_4.8%_95.9%)] w-full overflow-hidden">
                
                <SidebarProvider>

                  <div className={`w-full my-4 lg:w-fit ${isChatOpen ? "hidden lg:block" : "block"}`}>
                    <RestoreSidebar />
                  </div>


                  {/* Chat Area */}
                          <div className={`flex-1 my-4 mx-2 w-full overflow-hidden ${!isChatOpen ? "hidden md:block" : "block"}`}>
                            
                            <div className="h-full relative">
                  
                              {/* Chat content */}
                              {!selectedUser ? <NoChatSelected /> : <RestoreChatContainer />}
                            </div>

                          </div>
                </SidebarProvider>
        </div>
    )
}
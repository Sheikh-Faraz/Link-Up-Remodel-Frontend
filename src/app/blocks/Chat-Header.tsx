import { Video, Phone, MoreVertical, ArrowLeft } from "lucide-react"
import { useChat } from "@/app/store/Chatinfo";
import avatar from '@/app/images/avatarpic.png'
import { useState } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ProfileSidebar from "./Profile-Sidebar";

export default function ChatHeader() {
  
  const { selectedUser, onlineUsers, authUser ,blockUser, unblockUser, deleteUser, clearChat, chatOpen } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const UserPic = selectedUser?.profilePic;

  const imageUrl = UserPic?.startsWith("http")
  ? UserPic
  : `${BASE_URL}${UserPic}`;

  return (
    <div className="flex items-center justify-between p-4 bg-white w-full border-b-4 border-gray-300 z-10">  
      
      {/* Left - Avatar + Info */}
      <div className="flex items-center space-x-3">

      <button
          onClick={() => chatOpen(false)}
          className="lg:hidden text-sm p-1 text-gray-400 border rounded-md hover:bg-muted"
      >
            <ArrowLeft className="size-5 max-[425px]:size-4" />
      </button>

        <img 
          src={selectedUser?.profilePic === "" ? avatar.src : imageUrl} 
          // src={selectedUser?.profilePic || avatar.src} 
          alt={selectedUser?.fullName || "User Image"} 
          className="w-10 h-10 rounded-full" 
        />
        <div>
          <h3 className="font-semibold">{selectedUser?.fullName || "User Name"}</h3>
          {/* <p className="text-sm text-green-600">{status}</p> */}
          <p className={`text-sm ${onlineUsers.includes(selectedUser?._id || "") ? "text-green-600" : "text-red-600"}`}>
            {onlineUsers.includes(selectedUser?._id || "") ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-3">
        {/* <button className="p-2 rounded-full hover:bg-gray-100">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </button> */}

        <div className="p-2 rounded-full hover:bg-gray-100">
        {/* <button className="p-2 rounded-full hover:bg-gray-100"> */}
          {/* <MoreVertical className="w-5 h-5" /> */}

          <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-6 w-6 p-0 cursor-pointer">
                           <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-full">
                                      <DropdownMenuItem
                                        className="cursor-pointer my-2"
                                        onClick={() => setIsSidebarOpen(true)}
                                      >
                                        View Profile
                                      </DropdownMenuItem>
                                      
                                      <DropdownMenuItem
                                        className="cursor-pointer my-2"
                                        onClick={() => clearChat(selectedUser?._id || "")}
                                      >
                                        Clear Chat
                                      </DropdownMenuItem>

                                        {/* ================================================================= */}
                                                                                        
                                        {authUser?.blockedUsers?.includes(selectedUser?._id || "") ? 
                                          (
                                            <DropdownMenuItem
                                            onClick={() => unblockUser(selectedUser?._id || "")}
                                            className="cursor-pointer focus:bg-gray-200"
                                          >
                                            <button
                                              className="cursor-pointer focus:bg-gray-200"
                                            >
                                              Unblock 
                                            </button>
                                          </DropdownMenuItem>
                                      
                                          )
                                        : selectedUser?.blockedUsers?.includes(authUser?._id || "") ? (null) 
                                        : ( 
                                                                                        
                                        <DropdownMenuItem
                                          onClick={() => blockUser(selectedUser?._id || "")}
                                          className="cursor-pointer focus:bg-gray-200"
                                        >
                                          <button
                                            className="cursor-pointer focus:bg-gray-200 text-red-600 "
                                          >
                                            Block 
                                          </button>
                                         </DropdownMenuItem>
                                                                                        
                                        )}

                                        {/* ================================================================= */}
                                      
                                      <DropdownMenuItem
                                        variant="destructive"
                                        className="cursor-pointer my-2"
                                        onClick={() => deleteUser(selectedUser?._id || "")}
                                      >
                                        Delete 
                                      </DropdownMenuItem>
                      </DropdownMenuContent>
          </DropdownMenu>

          {selectedUser && (
              <ProfileSidebar
                open={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                user={selectedUser}
              />
          )}

        {/* </button> */}
        </div>
      </div>
    </div>
  )
}

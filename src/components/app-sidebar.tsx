"use client";

import { useState, useEffect } from "react";
import { Search, Ellipsis } from "lucide-react";
import ContactBlock from "../app/blocks/contact-block";
import { Spinner } from "@/components/ui/spinner";
import avatar from "@/app/images/avatarpic.png";

import { useChat } from "@/app/store/Chatinfo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { DialogDemo } from "@/app/blocks/DialogDemo";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


import { SquarePlus } from 'lucide-react';
import ProfileSidebar from "@/app/blocks/Profile-Sidebar";
// The thoughful experiemen

interface User {
  _id: string;
  UserId: string;
  fullName: string;
  profilePic?: string;
  about?: string;
  // email?: string;
  // phone?: string;
  // country?: string;
  // website?: string;
  // add any other fields you use in ProfileSidebar
}
export function AppSidebar() {
  const { selectUser, authUser, users, isUsersLoading, getUsers, blockUser, unblockUser, deleteUser } = useChat();
  const [search, setSearch] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userForProfile, setUserForProfile] = useState<User | null>(null);

  // ✅ Fetch users on mount
  useEffect(() => {
    getUsers();
  }, []);

  // ✅ Filter users by name
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sidebar
      collapsible="none"
      // className="py-2 mx-2 lg:mx-8 bg-white flex flex-col lg:w-[24rem] w-full h-screen border border-green-600" 
      className="py-2 mx-2 lg:mx-8 bg-white flex flex-col lg:w-[24rem] w-full h-full" 
    >
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 p-3 py-4 lg:py-3 border-b">
            <div className="flex items-center justify-between max-[315px]:flex-col max-[315px]:items-start">
              <h3 className="font-bold text-2xl">Chats</h3>
              <DialogDemo />
            </div>
          </div>

          {/* Search bar */}
          <div className="flex flex-col space-y-1.5 p-2 border-b mb-4">
            <div
              tabIndex={0}
              className="flex items-center text-center p-2 max-[375px]:p-1 border border-gray-300 rounded-md outline-none transition-colors duration-200 focus-within:border-gray-600"
            >
              <Search className="size-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="ml-2 border-none outline-none focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Users list */}
          <SidebarGroupContent className="flex-1 overflow-y-auto">
            <SidebarMenu>
              {/* Loading state */}

              {/* {!isUsersLoading ? ( */}
              {isUsersLoading ? (
                <div className="flex justify-center p-34">
                  <Spinner className="size-10"/>
                </div>
              ) : (
                <>
                {/* When filtered users exist */}
                {filteredUsers.length > 0 ? (
                  // {/* {filteredUsers.length > 0 && ( */}
                    filteredUsers.map((user) => (

                      <div key={user._id} className="relative">
                      
                      <ContactBlock
                        key={user._id}
                        id={user._id || ""}
                        name={user.fullName ?? "Unknown"}
                        profilePic={user.profilePic ?? avatar.src}
                        // avatar={avatar.src}
                        onClick={() => selectUser(user)}
                        />
                          {/* <Ellipsis /> */}
                          <div className="absolute top-3 right-3">
                                      <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button className="cursor-pointer bg-gray-50 hover:bg-gray-200 flex items-center justify-center rounded-full border">
                                                  <Ellipsis className="h-4 w-4 m-2" />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent className=" w-fit">
                                                  <DropdownMenuItem
                                                  onClick={() => {
                                                    setIsSidebarOpen(true);
                                                    setUserForProfile(user);
                                                  }}
                                                    className="cursor-pointer focus:bg-gray-200 w-full"
                                                  >
                                                    <button
                                                      className="cursor-pointer focus:bg-gray-200 px-3 py-1"
                                                    >
                                                      View Profile
                                                    </button>
                                                  </DropdownMenuItem>
                                                  
                                                  {/* ================================================================= */}
                                                  
                                                  {authUser?.blockedUsers?.includes(user?._id) ? 
                                                    (
                                                      <DropdownMenuItem
                                                      onClick={() => unblockUser(user._id)}
                                                      // onClick={() => blockUser(userId)}
                                                      className="cursor-pointer focus:bg-gray-200 w-full"
                                                    >
                                                      <button
                                                        className="cursor-pointer focus:bg-gray-200 px-3 py-1"
                                                      >
                                                        Unblock 
                                                      </button>
                                                    </DropdownMenuItem>

                                                    )
                                                  : user?.blockedUsers?.includes(authUser?._id || "") ? (null) 
                                                  : ( 
                                                  
                                                  <DropdownMenuItem
                                                    onClick={() => blockUser(user._id)}
                                                    // onClick={() => blockUser(userId)}
                                                    className="cursor-pointer focus:bg-gray-200 w-full"
                                                  >
                                                    <button
                                                      className="cursor-pointer focus:bg-gray-200 px-3 py-1 text-red-600 "
                                                    >
                                                      Block 
                                                    </button>
                                                  </DropdownMenuItem>
                                                  
                                                  )}
                                                  {/* ================================================================= */}

                                                  <DropdownMenuItem
                                                    onClick={() => deleteUser(user._id)}
                                                  // onClick={() => {
                                                  //   setIsSidebarOpen(true);
                                                  //   setUserForProfile(user);
                                                  // }}
                                                    className="cursor-pointer focus:bg-gray-200 w-full"
                                                  >
                                                    <button
                                                      className="cursor-pointer focus:bg-gray-200 px-3 py-1 text-red-600 "
                                                    >
                                                      Delete
                                                    </button>
                                                  </DropdownMenuItem>
                                             </DropdownMenuContent>
                                           </DropdownMenu>
                                   </div>
                         {/* <ProfileSidebar 
                          open={isSidebarOpen} 
                          onOpenChange={setIsSidebarOpen}
                            id={user._id || ""}
                            name={user.fullName ?? "Unknown"}
                            profilePic={user.profilePic ?? avatar.src}
                          /> */}
                      </div>
                    ))
                  ) 

                   : search.trim().length > 0 ? (
                    // 👇 Shown when user types something but no match found
                    <p className="text-center text-gray-500 mt-4">
                      No users found matching <span className="font-semibold">{`"${search}"`}</span>
                    </p>
                    ) : (
                      // 👇 Shown when there are simply no users at all
                    <p className="text-center text-gray-500 mt-4">
                      No users available
                    </p>
                  )
                  
                  // : (
                  //   // When no user matches the search
                  //   <p className="text-center text-gray-500 mt-4">
                  //     No users found
                  //   </p>
                  // )
                  }
                </>
              )}

                                {/* Shared Sidebar (Dynamic Data) */}
      {userForProfile && (
        <ProfileSidebar
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          user={userForProfile}
        />
      )}

              {/* When no firends or chats exist */} 
              {users.length < 0 && isUsersLoading && 
              (
                <div className="text-center justify-center py-8 ">
                  <SquarePlus className="m-auto" size={45}/>
                  <p className="mt-6 mb-2">No users currently</p> 
                  <p>Add friends and start chatting!</p> 
                </div>
              )}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

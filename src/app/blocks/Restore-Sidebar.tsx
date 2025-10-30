"use client";

import { useState, useEffect } from "react";
import { Search, SquarePlus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { useChat } from "@/app/store/Chatinfo";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";

import avatar from "@/app/images/avatarpic.png";
import RestoreContactBlock from "./Restore-Contact-Block";


export default function RestoreSidebar() {
  // const { selectUser, users, isUsersLoading, getUsers } = useChat();
  const { selectUser, users, isUsersLoading, getHiddenOrBlockedUsers, authUser, checkAuth } = useChat();
  const [search, setSearch] = useState("");

    useEffect(() => {
      checkAuth();
   }, [authUser, checkAuth]);
  // ✅ Fetch users on mount
  useEffect(() => {
    getHiddenOrBlockedUsers();
  }, []);

  // ✅ Filter users by name
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sidebar
      collapsible="none"
      className="py-2 mx-2 lg:mx-8 bg-white flex flex-col lg:w-[24rem] w-full h-full"  
      // className="my-4 mx-8 bg-white h-[35rem] flex flex-col w-[35rem]"
    >
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 p-3 py-4 my-4 lg:py-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Blocked & Deleted Contacts</h3>
              {/* <DialogDemo /> */}
            </div>
          </div>

          {/* Search bar */}
          {/* <div className="flex flex-col space-y-1.5 p-2 py-4 lg:py-4 border-b"> */}
          <div className="flex flex-col space-y-1.5 p-2 mb-4 border-b">
            <div
              tabIndex={0}
              className="flex items-center text-center p-2 max-[375px]:p-1 block border border-gray-300 rounded-md outline-none transition-colors duration-200 focus-within:border-gray-600"
            >
              <Search className="size-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Contacts search..."
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
                      
                      <RestoreContactBlock
                        key={user._id}
                        id={user._id || ""}
                        name={user.fullName ?? "Unknown"}
                        profilePic={user.profilePic ?? avatar.src}
                        isDeleted={authUser?.isDeletedFor.includes(user._id) ? true : false}
                        isBlocked={authUser?.blockedUsers.includes(user._id) ? true : false}
                        onClick={() => selectUser(user)}
                        />
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
                  
                  }
                </>
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

"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import avatar from "@/app/images/avatarpic.png";
import { useChat } from "@/app/store/Chatinfo";
import { useEffect } from "react";

export default function RestoreChatContainer() {

    const { selectedUser, authUser, restoreUser, unblockUser, checkAuth, chatOpen, selectUser } = useChat();

    useEffect(() => {
      checkAuth();
    }, [authUser, checkAuth]);

  return (
    // <div className="flex justify-center overflow-y-auto">
    <div className="flex justify-center overflow-hidden h-full">

      <Card className="max-w-5xl w-full shadow-sm rounded-xl">
        <CardContent className="p-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-start mb-9 gap-4 max-[516px]:flex-col">
            <div className="flex items-center gap-4 max-[286px]:flex-col max-[286px]:items-start">

                <button
                  onClick={() => {
                    chatOpen(false);
                    selectUser(null);
                  }}
                  className="lg:hidden text-sm p-1 text-gray-400 border rounded-md hover:bg-muted"
                >
                  <ArrowLeft className="size-5 max-[425px]:size-4" />
                </button>

              <Image
                src={selectedUser?.profilePic || avatar.src}
                alt={selectedUser?.fullName || "Profile image"}
                width={45}
                height={45}
                className="rounded-full object-cover"
              />

              <div className="flex-wrap">
                  <h2 className="text-lg max-[425px]:text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedUser?.fullName || "User Name"}
                  </h2>
              
                {/* <p className="text-sm max-[425px]:text-xs text-gray-500 dark:text-gray-400"> */}
                  <p className="text-sm text-wrap max-[425px]:text-xs text-gray-500 dark:text-gray-400">
                    {selectedUser?.email || "example@gmail.com"}
                  </p>
              </div>
              
            </div>

            {/* <div className="flex gap-4 max-[516px]:mt-6 max-[222px]:flex-col max-[286px]:mx-auto"> */}
            <div className="flex gap-4 max-[516px]:mt-6 max-[222px]:flex-col max-[222px]:gap-2">
              {/* If the Contact/User was deleted by LoggedIn-User then show restore button */}
              {authUser?.isDeletedFor?.includes(selectedUser?._id || "") && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 max-[425px]:text-xs"
                onClick={() => restoreUser(selectedUser?._id || "")}
              >
                Restore
              </Button>
            )}

            {/* //   onClick={onNewChat} */}
           {authUser?.blockedUsers?.includes(selectedUser?._id || "") && (

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 max-[425px]:text-xs"
              onClick={() => unblockUser(selectedUser?._id || "")}
            >
              UnBlock
            </Button>
           )}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8 text-sm text-gray-700 dark:text-gray-300">
            {/* About */}
              <div>
                <p className="uppercase text-xs text-gray-500 mb-3 font-semibold">
                  About
                </p>
                <p className="max-[425px]:text-xs">{selectedUser?.about || "User About"}</p>
                {/* <p className="max-[425px]:text-[11px]">{selectedUser?.about || "User About"}</p> */}
              </div>

            {/* UserId */}
              <div>
                <p className="uppercase text-xs text-gray-500 mb-3 font-semibold">
                  User-Id
                </p>
                <p className="max-[425px]:text-xs">{selectedUser?.UserId || "UserId"}</p>
              </div>

            {/* Status for Block */}
              <div>
                <p className="uppercase text-xs text-gray-500 mb-3 font-semibold">
                  Status
                </p>
                
                <div>
                    
                    {authUser?.blockedUsers?.includes(selectedUser?._id || "") ? 
                       (
                        <p className="max-[425px]:text-xs">
                            You have blocked this user. 
                        </p>
                        ) : selectedUser?.blockedUsers?.includes(authUser?._id || "") ? (
                          <p className="max-[425px]:text-xs">
                            You were blocked by {selectedUser?.fullName || "user"}.
                          </p>
                        ) : (
                          <p className="max-[425px]:text-xs">
                            Block to stop receiving messages
                          </p>
                        )
                    }

                </div>
              </div> 

            {/* Status if Deleted-for-Me */}
              <div>
                <p className="uppercase text-xs text-gray-500 mb-3 font-semibold">
                  Deleted
                </p>
                <div>
                  {authUser?.isDeletedFor?.includes(selectedUser?._id || "") ? (
                    <p className="max-[425px]:text-xs">True</p>
                  ) :(
                    <p className="max-[425px]:text-xs">False</p>
                  )
                }
                </div>
              </div>
            

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

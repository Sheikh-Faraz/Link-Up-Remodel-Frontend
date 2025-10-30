"use client";

import { useChat } from "@/app/store/Chatinfo";
import { useEffect, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Camera, Mail, User, Check , Copy, FileUser, CircleAlert } from "lucide-react";
import avatar from "@/app/images/avatarpic.png"
import EditProfile from "@/app/blocks/EditProfile";
import { useGlobalLoading } from "@/app/store/LoadingContext";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const { authUser, fetchUser} = useChat();
  const [copied, setCopied] = useState(false);

  const { setIsLoading } = useGlobalLoading();
        
    useEffect(() =>{
      setIsLoading(false);
    }, [setIsLoading])

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-darkbg">
        <Spinner className="size-10"/>
      </div>
    );
  }

  const handleCopy = async () => {
    if (authUser?.UserId) {
      await navigator.clipboard.writeText(authUser.UserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // revert after 1.5s
    }
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const UserPic = authUser.profilePic;

  const imageUrl = UserPic?.startsWith("http")
  ? UserPic
  : `${BASE_URL}${UserPic}`;

  return (
    <div className="h-full w-full pt-20 max-[425]:pt-10 overflow-y-auto bg-darkbg">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser?.profilePic === "" ? avatar.src : imageUrl}
                // src={authUser.profilePic || avatar.src}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${"animate-pulse pointer-events-none"}
                  `}
                  >
                  {/* //   ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}  */}
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                //   onChange={handleImageUpload}
                //   disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* <p className="text-sm text-zinc-400">
              {"Click the camera icon to update your photo"}
            </p> */}

            <div className="my-4">
              <EditProfile />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <FileUser className="w-4 h-4" />
                UserId
              </div>
                       <InputGroup>
                        <InputGroupInput 
                          readOnly
                        />
                          <InputGroupAddon>
                            <p className="px-2 py-2.5 bg-base-200 text-black">
                              {authUser?.UserId || "UserId not credted or not exists"}
                            </p>
                          </InputGroupAddon>
          
                       <InputGroupAddon align="inline-end">
                
                       <Tooltip>
                           <TooltipTrigger asChild>

                       <InputGroupButton
                          onClick={handleCopy}
                         >
                           {copied ? <Check size={18} /> : <Copy size={18} />}
                        </InputGroupButton>
          
                        </TooltipTrigger>
                          <TooltipContent>
                            <p>{copied ? "Copied" : "Copy"}</p>
                          </TooltipContent>
                        </Tooltip>
          
                        </InputGroupAddon>
                       </InputGroup>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>


            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <CircleAlert className="w-4 h-4" />
                About
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.about || "Hey! Let's chat"}</p>
            </div>

          {/* <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

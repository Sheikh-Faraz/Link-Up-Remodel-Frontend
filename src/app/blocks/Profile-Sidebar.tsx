"use client";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import Avatar from "@/app/images/avatarpic.png";
import { Facebook, X, Linkedin, Instagram, Dribbble } from "lucide-react";

import { useEffect } from "react";

import { useChat } from "@/app/store/Chatinfo";

interface ProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
    user: {
    _id: string;
    UserId: string;
    fullName?: string;
    profilePic?: string;
    about?: string;
  };
}

export default function ProfileSidebar({ open, onOpenChange, user }: ProfileSidebarProps) {
  const { onlineUsers, previewSidebar } = useChat();

  useEffect(() => {
        previewSidebar(true);
  }, [previewSidebar]);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const UserPic = user.profilePic;

  const imageUrl = UserPic?.startsWith("http")
  ? UserPic
  : `${BASE_URL}${UserPic}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] bg-white dark:bg-gray-900 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <SheetHeader>
            <SheetTitle>
                Profile
            </SheetTitle>
            </ SheetHeader>

          {/* Profile Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Image
                src={user.profilePic === "" ? Avatar.src : imageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-2">
                {user.fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status:{" "}
              <span className={`${onlineUsers.includes(user._id || "") ? "text-green-500" : "text-red-500"} font-medium`}>
                {onlineUsers.includes(user._id || "") ? "Online" : "Offline"}
              </span>
            </p>
          </div>

          {/* Info sections */}
          <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
            <div className="my-6">
              <p className="font-semibold mb-2">ABOUT</p>
              <p>
                {user.about || "No information provided."}
              </p>
            </div>

            <div className="my-6">
              <p className="font-semibold mb-2">USER-ID</p>
              <p>
                {user.UserId || "N/A"}
              </p>
            </div>

            
            <SheetFooter>

            <div className="my-6">
              <p className="font-semibold mb-2">SOCIAL LINKS</p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Dribbble className="h-4 w-4" />
                </a>
              </div>
            </div>
                  </SheetFooter>
          </div>
        </div>
      </SheetContent>   
    </Sheet>
  );
}

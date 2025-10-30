"use client";

import { useState, useEffect } from "react";
import Link  from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, User, Users, LogOut } from "lucide-react";

import { useChat } from "@/app/store/Chatinfo";
import { useGlobalLoading } from "../store/LoadingContext";

import LinkUpLogo from "@/app/images/Linkup-logo.png"
import Image from "next/image";

export default function SidebarLocked() {
  const pathname = usePathname(); // gives current route like "/Home", "/Profile", etc.

  const [active, setActive] = useState(1);
  const { logout, selectUser } = useChat();

  const { setIsLoading } = useGlobalLoading();

  useEffect(() => {
    if (pathname === "/Home") {
      setActive(2);
    } else if (pathname === "/Profile") {
      setActive(3);
    } else if (pathname === "/Restore-Contacts") {
      setActive(4);
    } else {
      setActive(2); // or any default
    }
  }, [pathname, setActive]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col items-center justify-between h-screen w-16 py-4 border-r bg-white">
      {/* <div className="flex flex-row items-center h-fit w-full py-4 border border-black bg-white justify-evenly"> */}
        {/* Top Section */}
        {/* <div className="flex flex-row items-center gap-6 justify-evenly w-full"> */}
        <div className="flex flex-col items-center gap-6">
          {/* Chats */}
              <div
                className={`p-2 rounded-xl transition-colors duration-200 bg-white text-black`}
              >
                <Image 
                  src={LinkUpLogo.src} 
                  alt={"Logo"}
                  width={35}
                  height={35}
                />
              </div>

          {/* Messages */}
          <Tooltip>
            <TooltipTrigger asChild>
              {/* ======================================================================================== */}

                <div
                  onClick={() => {
                    // Only trigger if not already active
                    if (active !== 2) {
                      setActive(2);
                    }
                  }}
                  className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                    active === 2
                      ? "bg-[#4CBBA3] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {active === 2 ? (
                    // If active, show just icon (no Link)
                    <MessageCircle className="size-6" /> 
                  ) : (
                    // If not active, make it clickable
                    <Link href="/Home"
                     onClick={() => {
                      selectUser(null);
                      setIsLoading(true);
                    }}
                    >
                      <MessageCircle className="size-6" />
                    </Link>
                  )}
                </div>
            {/* ======================================================================================== */}

            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Chats</p>
            </TooltipContent>
          </Tooltip>

          {/* Profile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => {
                  if (active !== 3) {
                      setActive(3);
                    }
                  }}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 3
                    ? "bg-[#4CBBA3] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {active === 3 ? (
                    // If active, show just icon (no Link)
                    <User className="size-6" />
                  ) : (
                    <Link href="/Profile" onClick={() => {
                      selectUser(null);
                      setIsLoading(true);
                      }}>
                      <User className="size-6" />
                    </ Link>
                  )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>

          {/* Contacts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => {
                  if (active !== 4) {
                      setActive(4);
                    }
                  }}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 4
                    ? "bg-[#4CBBA3] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {active === 4 ? (
                    // If active, show just icon (no Link)
                    <Users className="size-6" />
                  ) : (
                    <Link href="/Restore-Contacts" onClick={() => {
                      selectUser(null);
                      setIsLoading(true);
                      }}>
                      <Users className="size-6" />
                    </Link>
                  )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Restore Contacts</p>
            </TooltipContent>
          </Tooltip>

          {/* Logout */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <div
                // onClick={() => setActive(8)}
                onClick={logout}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 8
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LogOut className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip> */}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-6">


        {/* <div className="flex flex-row items-center gap-6 justify-evenly w-full"> */}


          {/* Archive */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setActive(5)}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 5
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Box className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Archive</p>
            </TooltipContent>
          </Tooltip> */}

          {/* Theme */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setActive(6)}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 6
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Sun className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Theme</p>
            </TooltipContent>
          </Tooltip> */}

          {/* Settings */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setActive(7)}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 7
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Cog className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip> */}



          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={logout}
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  active === 8
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LogOut className="size-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>


        </div>
      </div>
    </TooltipProvider>
  );
}

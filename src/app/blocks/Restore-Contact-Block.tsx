import Image from "next/image";
import avatar from '@/app/images/avatarpic.png'
import { Badge } from "@/components/ui/badge"
// import { useChat } from "../store/Chatinfo";
import { useEffect } from "react";

interface ContactProps {
  name: string;
  profilePic: string;
  id: string;
  isDeleted: boolean;
  isBlocked: boolean;
  onClick?: () => void;
}

export default function RestoreContactBlock({
  name,
  profilePic,
  isDeleted,
  isBlocked,
//   id,
  onClick,
}: ContactProps) {  

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const imageUrl = profilePic?.startsWith("http")
  ? profilePic
  : `${BASE_URL}${profilePic}`;

  return (
    <div className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      {/* Left section: avatar + info */}
      <div className="flex items-center gap-3 w-full">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={profilePic === "" ? avatar.src : imageUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>

        {/* Name + Message */}
        {/* <div className="flex flex-col"> */}
        <div className="flex flex-1 justify-between max-[375px]:flex-col max-[375px]:items-start">
          <span className="font-medium">{name}</span>
        <div className="flex max-[375px]:mt-2 ">
          {isBlocked && <Badge variant="secondary" className="max-[375px]:mr-1 ">Blocked</Badge>}
          {isDeleted && <Badge variant="destructive" className="max-[375px]:ml-1 ">Deleted</Badge>}
        </div>  
        </div>
        
      </div>
      <div>

      </div>
    </div>
  );
}

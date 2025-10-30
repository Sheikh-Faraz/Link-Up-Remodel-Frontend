import Image from "next/image";
import avatar from '@/app/images/avatarpic.png'
import { useChat } from "@/app/store/Chatinfo";

interface ContactProps {
  name: string;
  profilePic: string;
  id: string;
  // message: string;
  // time: string;
  // avatar: string;
  // unread?: number;
  onClick?: () => void;
}

export default function ContactBlock({
  name,
  profilePic,
  id,
  // message,
  // time,
  // avatar,
  // unread,
  onClick,
}: ContactProps) {

  const { onlineUsers } = useChat();  

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const imageUrl = profilePic?.startsWith("http")
  ? profilePic
  : `${BASE_URL}${profilePic}`;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      {/* Left section: avatar + info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={profilePic === "" ? avatar.src : imageUrl}
            // src={imageUrl === "" ? avatar.src : imageUrl}
            // src={imageUrl || avatar.src}
            alt={name}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
            style={{ objectPosition: "center" }}
          />
          {/* Online dot */}
          <span className={`absolute bottom-0 right-0 block w-3 h-3 ${onlineUsers.includes(id || "") ? "bg-green-500" : "bg-red-500"} border-2 border-white rounded-full`}></span>
        </div>

        {/* Name + Message */}
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
          <span className={`text-sm ${onlineUsers.includes(id || "") ? "text-green-500" : "text-red-500"}`}>
            {onlineUsers.includes(id || "") ? "Online" : "Offline"}
          </span>
          </div>
        </div>
      </div>

      {/* Right section: time + unread badge */}
      {/* <div className="flex flex-col items-end gap-1"> */}
      <div>

        {/* <span className="text-xs text-gray-400">{time}</span> */}
        {/* {unread && unread > 0 && (
          <span className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-green-500 rounded-full">
            {unread}
          </span>
        )} */}
      </div>
    </div>
  );
}

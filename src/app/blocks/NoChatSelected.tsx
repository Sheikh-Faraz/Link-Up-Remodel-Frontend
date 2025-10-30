import defaultChatBg from '@/app/images/Default-Chat-Bg.png';
import Image from 'next/image';

export default function NoChatSelected() {
  return (
    <div className="flex items-center justify-center h-full">
      <Image 
        src={defaultChatBg}
        alt="Default chat background"
        width={400}
      />
    </div>
  );
}

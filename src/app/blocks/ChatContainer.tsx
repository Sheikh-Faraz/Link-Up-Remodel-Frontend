import ChatHeader from "./Chat-Header"
import ChatMessages from "./Chat-Messages-Container"
import ChatInput from "./Chat-Input"

export default function ChatContainer() {    
  return (
    // <div className="flex flex-col border rounded-lg h-[100dvh] border-red-600 ">
    <div className="flex flex-col border rounded-lg h-screen">
    {/* // <div className="flex flex-col w-full mx-auto border rounded-lg h-[35rem] border border-red-600"> */}
    {/* // <div className="flex flex-col w-full mx-auto border rounded-lg h-full border border-red-600"> */}
      <ChatHeader />
      
      {/* Middle: Scrollable Messages */}
      {/* <div className="flex-1 overflow-y-auto border border-blue-600"> */}
      {/* <div className="w-full overflow-y-auto min-h-0"> */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ChatMessages />
      </div>
      
      <ChatInput />
    </div>
  );
}

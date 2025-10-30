"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/app/store/Chatinfo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Ellipsis, MessageSquareText, CornerUpLeft, CheckCheck, Copy } from "lucide-react";
import MessageSkeleton from "@/app/Skeletons/MessageSkeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


  function MessageDropdown({
  isOwn,
  msg,
  handleCopy,
  setOpenEdit,
  setOpenDelete,
  selectReply,
}: {
  isOwn: boolean;
  msg: { text?: string; fileType?: string };
  handleCopy: () => void;
  setOpenEdit: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  selectReply: (msg: { text?: string; fileUrl?: string; fileType?: string; fileName?: string }) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 p-0 cursor-pointer"
        >
          <Ellipsis className="h-4 w-4 text-gray-800" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-36">
        {msg.text === "🛇 This message was deleted" ? (
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setOpenDelete(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-200"
              onClick={() => selectReply(msg)}
            >
              <CornerUpLeft className="h-4 w-4 mr-2" /> Reply
            </DropdownMenuItem>

            {msg.fileType !== "audio" && (
              <DropdownMenuItem
                className="cursor-pointer focus:bg-gray-200"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </DropdownMenuItem>
            )}

            {isOwn && msg.text && (
              <DropdownMenuItem
                className="cursor-pointer focus:bg-gray-200"
                onClick={() => setOpenEdit(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


// // 🖼️ Optional image preview modal
function ImageWithPreview({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt="Sent image"
        onClick={() => setOpen(true)}
        className="rounded-lg max-w-[250px] max-h-[250px] object-cover mb-2 cursor-pointer hover:opacity-90 transition"
      />
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-zoom-out"
        >
          <img src={src} alt="Full" className="max-w-[90%] max-h-[90%]" />
        </div>
      )}
    </>
  );
}

function MessageBubble({
  children,
  id,
  time,
  isOwn,
  replyTo,
  isText = true,
  isEdited = false, // 🆕 new prop
  seenby,
  msg,
}: {
  children: React.ReactNode;
  id: string;
  time: string;
  isOwn?: boolean;
  isText?: boolean;
  isEdited?: boolean;
  seenby?: string[];
  msg: { text?: string; fileUrl?: string; fileType?: string; fileName?: string };
  // replyTo?: string; // 🆕 new prop
  replyTo?: string | null; // ✅ handles all possible cases
}) {
  const { editMessage, deleteMessage, selectedUser, selectReply,onlineUsers } = useChat(); // 🆕 imported
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newText, setNewText] = useState(String(children));

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(msg.text || ""));
  };

  const handleSaveEdit = async () => {
    // await editMessage(id, newText);
    await editMessage(id, newText, selectedUser?._id || "");
    setOpenEdit(false);
  };

  const handleDelete = async (forEveryone = false) => {
    // await deleteMessage(id, forEveryone, selectedUser?._id || "");
    await deleteMessage(id, selectedUser?._id || "" , forEveryone);
    setOpenDelete(false);
  };

  return (
      <div className="mb-5 w-full block overflow-hidden">

    <div className={`flex mb-2 items-start  group ${isOwn ? "justify-end" : ""}`}>

      {/* {isOwn && <div>something</div>} */}
      
      <div className="my-auto mr-2">
        {isOwn && 
        <MessageDropdown
          isOwn={true}
          msg={msg}
          handleCopy={handleCopy}
          setOpenEdit={setOpenEdit}
          setOpenDelete={setOpenDelete}
          selectReply={selectReply}
        /> 
      }
      </div>

      {/* {!isOwn && <div className="text-xs text-gray-500 mr-2 self-end">{time}</div>} */}
      <div
        className={`relative rounded-lg shadow p-1 transition-all duration-200 ${
          isOwn ? "bg-[#4CBBA3] text-white" : "bg-white text-gray-800"
        } ${msg.fileType === "image" ? "max-w-[260px]" : "max-w-sm"}`} // 🆕 wider for media
        >

        {/* 💬 Reply Preview Box */}
{/* {Array.isArray(msg.replyTo) && msg.replyTo.length > 0 && ( */}
{Array.isArray(replyTo) && replyTo.length > 0 && (
  <div
    className={`border-l-4 pl-3 pr-2 py-1 mb-2 rounded-md ${
      isOwn ? "border-white/60 bg-[#6FD5AA]" : "border-green-400 bg-gray-100"
    }`}
  >
    {replyTo[0].fileUrl && (
      replyTo[0].fileType === "image" ? (
        <img
          src={`${BASE_URL}${replyTo[0].fileUrl}`}
          alt="Replied image"
          // className="rounded-md max-w-[80px] max-h-[80px] object-cover mb-1"
          className="rounded-md max-w-[80px] max-h-[80px] object-cover mb-1"
        />
      ) : (
        <div className={`flex items-center space-x-2 mb-3 text-xs ${isOwn ? "text-white" : "text-gray-700"}`}>
          📎 <span> {replyTo[0].fileName || "Document"}</span>
        </div>
      )
    )}

    {replyTo[0].text && (
      <p
        className={`text-xs line-clamp-2 ${
          isOwn ? "text-white/90" : "text-gray-700"
        }`}
      >
        {replyTo[0].text}
      </p>
    )}
  </div>
)}

{/* 💬 Actual Message Text / File */}
{msg.fileUrl && (
  <>
    {msg.fileType === "image" ? (
      <ImageWithPreview src={`${BASE_URL}${msg.fileUrl}`} />
    ) : msg.fileType === "audio" ? (
      <div className="mb-2">
        <audio controls src={`${BASE_URL}${msg.fileUrl}`} />
      </div>
    ): (
      <a
        // href={msg.fileUrl}
        href={`${BASE_URL}${msg.fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center space-x-2 ${
          isOwn ? "bg-[#4CBBA3]" : "bg-gray-100"
        } rounded-md px-2 py-1 mb-2 text-sm hover:opacity-90 transition`}
      >
        <span>📄 {msg.fileName || "Document"}</span>
      </a>
    )}
  </>
)}

{msg.text && (
  <p
    className={`text-sm transition-all duration-300 m-2 ${
      msg.text === "🛇 This message was deleted"
        ? `${isOwn ? "italic text-white opacity-70" : "italic text-black opacity-70"}`
        : "opacity-100"
    }`}
  >
    {msg.text}
    {isEdited && (
      <span className="ml-2 text-xs italic opacity-70">(edited)</span>
    )}
  </p>
)}
      </div>

      {/* ===================== Edit Dialog ===================== */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
            <DialogDescription>Modify your message and save changes.</DialogDescription>
              <div className="mt-4 p-10 justify-center bg-muted">
                <div
                  className="relative rounded-lg shadow p-3 w-fit text-white bg-[#6FD5AA] m-auto text-center"
                >
                  {children}
                </div>
              </div>
          </DialogHeader>
          <textarea
            className="w-full border-2 border-gray-300 rounded-md p-2 mt-2 text-sm"
            placeholder="Edit your message..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== Delete Dialog ===================== */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col mt-5 space-y-2 items-end">

            {children === "🛇 This message was deleted" ? (

              <Button className="w-fit" variant="destructive" onClick={() => handleDelete(false)}>
                Delete for me
              </Button>

          ):(
            <div className="flex flex-col space-y-2 items-end">
            <Button className="w-fit" variant="destructive" onClick={() => handleDelete(false)}>
              Delete for me ?
            </Button>

            {isOwn && (
            <Button className="w-fit" variant="destructive" onClick={() => handleDelete(true)}>
              Delete for everyone
            </Button>
          )}
            </div>
          )}

            <Button className="w-fit" variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="my-auto ml-2">
        {!isOwn && 
          <MessageDropdown
            isOwn={false}
            msg={msg}
            handleCopy={handleCopy}
            setOpenEdit={setOpenEdit}
            setOpenDelete={setOpenDelete}
            selectReply={selectReply}
          />
        }
      </div> 

    </div>
    {/* Showing time & Check/seen/read mark */}
      {!isOwn && <div className="text-xs text-gray-500 ml-1 text-start">{time}</div>}

      {isOwn && <div className="text-xs text-gray-500 mr-1 flex justify-end">
        <span>{time}</span>
        {seenby?.includes(selectedUser?._id || "") ? (
          <span>{isOwn && <CheckCheck className={`size-4 mr-1 ml-2 text-green-500`} />}</span> 
          // <CheckCheck className="size-4 ml-2 text-green-500" />
        ) : (
          // <Check className="size-4 ml-2 text-gray-500" />
          <CheckCheck className={`size-4 mr-1 ml-2 ${onlineUsers.includes(selectedUser?._id || "") ? "text-green-500" : ""}`} />
        )}      
        </div>
      }
    </div>

  );
}

export default function ChatMessages() {
  const { 
    selectedUser, 
    messages, 
    getMessages, 
    isMessagesLoading, 
    authUser, 
    fetchUser, 
    subscribeToMessages, 
    unsubscribeFromMessages,
  } = useChat();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchUser();
    if (selectedUser) getMessages(selectedUser._id);
    // The getting messagees of the user indicate that the messages are read by me so update the seen status
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        Select a user to start chatting 💬
      </div>
    );
  }

  if (isMessagesLoading) return <MessageSkeleton />;

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50 h-full text-center">
        <MessageSquareText size={45} />
        <p className="mt-6">No messages yet — say hi 👋</p>
      </div>
    );
  }

  return (
    // <div className="flex-1 overflow-hidden p-4 bg-gray-50 w-full">
    // <div className="flex-1 overflow-y-auto p-4 bg-gray-50 w-full">
    <div className=" p-4 bg-gray-50 w-full">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          msg={msg}
          replyTo={msg.replyTo}  // 🆕
          id={msg._id}
          time={new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          isOwn={String(msg.senderId) === String(authUser?._id)}
          isEdited={msg.isEdited} // 🆕
          seenby={msg.seenBy}
        >
          {msg.text}
        </MessageBubble>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

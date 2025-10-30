"use client";

import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/store/Chatinfo";
import { Smile, Paperclip, Mic, X, SendHorizontal, Loader2, MoreVertical, LoaderCircle } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import VoiceRecorder from "@/app/blocks/VoiceRecorder";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function ChatInput() {
  const { sendMessage, selectedUser, replyingTo, cancelReply, isPreviewing, previewingToggle, authUser, unblockUser, deleteUser} = useChat();

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

const handleVoiceBlob = async (blob: Blob) => {
  if (!selectedUser) return;

  // Create a File (so your existing sendMessage logic that expects File works)
  const fileName = `voice-${Date.now()}.webm`;
  const voiceFile = new File([blob], fileName, { type: blob.type || "audio/webm" });

  // Prepare reply payload same as you do for text reply
  let replyData;
  if (replyingTo) {
    replyData = {
      text: replyingTo.text || "",
      fileUrl: replyingTo.fileUrl || "",
      fileType: replyingTo.fileType || "",
      fileName: replyingTo.fileName || "",
    };
  }

  setIsUploading(true);
  await sendMessage(selectedUser._id, /* text */ "", replyData, voiceFile, voiceFile.name);
  previewingToggle(false);
  setIsUploading(false);
  // clear reply and UI if needed
  cancelReply();
};

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧮 Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = async () => {
    if ((!message.trim() && !file) || !selectedUser) return;
    
    let replyData;
    if (replyingTo) {
      replyData = {
        text: replyingTo.text || "",
        fileUrl: replyingTo.fileUrl || "",
        fileType: replyingTo.fileType || "",
        fileName: replyingTo.fileName || "",
      };
    }

    setIsUploading(true);
    await sendMessage(
      selectedUser._id,
      message, 
      replyData,
      file || undefined,
      file?.name || "",
    )

    setIsUploading(false);

    setMessage("");
    setFile(null);
    setShowPreview(false);
    cancelReply(); // clear the reply box
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowPreview(true); // show preview popup 
    }
  };

  return (
    <div className="relative p-3 border-t bg-white w-full max-[560px]:p-1">
      {/* Emoji picker popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-24 max-[560px]:right-5 z-50" ref={pickerRef}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={window.innerWidth < 560 ? 260 : 320}
            height={window.innerWidth < 560 ? 250 : 400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

        {/* ===================== Preview Dialog ===================== */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preview</DialogTitle>
                </DialogHeader>
                            {/* File preview */}
            {file?.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover rounded-md mb-2 border"
              />
            ) : (
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md mb-2">
                <Paperclip className="w-5 h-5 text-gray-500" />
                <div className="flex-1 max-w-xs">
                  <span className="text-sm font-medium block truncate">
                    {file?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file?.size || 0)}
                  </span>
                </div>
              </div>
            )}
                <DialogFooter className="mt-4">
            <div className="flex flex-col space-y-4 w-full">

            {/* Caption input */}
            <div className="flex space-x-2">

            <input
              type="text"
              placeholder="Add a caption..."
              className="flex-1 mt-1 border border-gray-300 rounded-md px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploading}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isUploading}
              className="w-fit p-2 bg-green-400 text-white rounded-md flex justify-center items-center hover:bg-green-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isUploading ? (
                <>
                  <LoaderCircle className="animate-spin size-5 max-[320px]:size-4"/> 
                </>
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4 mr-1" />
                  {/* Send */}
                </>
              )}
            </button>
              </div>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Cancel
                  </Button>
            </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      {/* ======================================================================================================== */}

      {/* ======================================================================================================== */}
                                                  {/* REPLY BOX */}
      {/* ======================================================================================================== */}
      {/* 🟦 Reply box (shows when user clicks “Reply”) */}
{replyingTo && (
  <div className="absolute bottom-16 left-0 w-full px-3 z-20">
  <div className="flex items-center justify-between bg-gray-100 mr-3 p-2 mb-2 rounded-md border-l-4 border-green-500">
  
    <div className="flex flex-col text-sm max-w-[80%]">
      <span className="text-gray-600 font-medium mb-0.5">Replying to</span>

      {/* Text message */}
      {replyingTo.text && (
        <span className="text-gray-800 truncate">{replyingTo.text}</span>
      )}

      {/* Image message */}
      {replyingTo.fileUrl && replyingTo.fileType === "image" && (
        <img
          src={`${BASE_URL}${replyingTo.fileUrl}`}
          alt="reply"
          className="w-12 h-12 object-cover rounded mt-1"
        />
      )}

      {/* Document message */}
      {replyingTo.fileUrl && replyingTo.fileType !== "image" && (
        <span className="text-gray-500 text-xs mt-1">
          📄 {replyingTo.fileName}
        </span>
      )}
    </div>

    {/* Cancel button */}
    <button
      onClick={() => cancelReply()}
      className="text-gray-400 hover:text-gray-600 transition"
    >
      <X className="w-4 h-4" />
    </button>
    </div>
  </div>
)}
      {/* ======================================================================================================== */}

      {/* Main input area */}
       {authUser?.blockedUsers?.includes(selectedUser?._id || "") ? 
       (
        <div className="p-4 text-center text-red-500 font-medium">
          You have blocked this user. Unblock to send messages.
          <div className="flex mt-4 items-center justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // Unblock user logic
                if (selectedUser) {
                  unblockUser(selectedUser._id);
                }
              }}
              className="mt-2 flex-1 bg-green-600 text-white"
            >
              Unblock 
            </Button>
            <Button
              onClick={() => {
                // Delete user logic
                if (selectedUser) {
                  deleteUser(selectedUser._id);
                }
              }}
              variant="destructive"
              className="mt-2 flex-1"
            >
              Delete 
            </Button>
          </div>
        </div>
       )
       : selectedUser?.blockedUsers?.includes(authUser?._id || "") ? (
          <div className="p-4 text-center text-red-500 font-medium">
            You were blocked by this user. You can’t send messages.
          </div>
        ) 
        : (      
      <div className={`flex items-center space-x-2 rounded-lg p-2 `}>
      {!isPreviewing &&
        <>
        <input
          type="text"
          placeholder="Enter message..."
          className="flex-1 bg-gray-100 border-none outline-none px-2 py-2 max-[560px]:p-1 max-[320px]:text-xs rounded-md text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isUploading}
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          className="p-2 hover:text-[#6FD5AA] relative cursor-pointer max-[560px]:hidden"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          disabled={isUploading}
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          className="p-2 hover:text-[#6FD5AA] cursor-pointer max-[560px]:hidden"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="hidden max-[560px]:block">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer bg-gray-50 hover:bg-gray-200 flex items-center justify-center rounded-full border">
                   <MoreVertical className="size-5 max-[320px]:size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-max w-fit">

                    <DropdownMenuItem>
                      <button
                        className="cursor-pointer w-fit flex"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        disabled={isUploading}
                      >
                        <Smile className="size-5 max-[320px]:size-4" />
                        <span className="ml-2">Emoji</span>
                      </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <button
                        className="cursor-pointer w-fit flex"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Paperclip className="size-5 max-[320px]:size-4" />
                        <span className="ml-2">Document</span>
                      </button>
                    </DropdownMenuItem>

                </DropdownMenuContent>
        </DropdownMenu>
                                                        
        </div>

        </>
      }

        <div className={`${isPreviewing ? 'w-full' : ''}`}>
          <VoiceRecorder onSend={handleVoiceBlob} autoSend={false} />
        </div>

      {!isPreviewing && <>
        <button
          onClick={handleSend}
          disabled={isUploading}
          className="bg-green-400 text-white px-4 py-2 max-[560px]:p-2 rounded-md hover:bg-green-300 disabled:opacity-60 transition"
          >
          <span  className="block max-[560px]:hidden">  
            {/* {isUploading ? "..." : "Send"} */}
            {isUploading ? 
              <LoaderCircle className="animate-spin size-5 max-[320px]:size-4"/> 
                : 
              "Send"
            }
          </span>
          <span className="hidden max-[560px]:block">
            {isUploading ? 
              <LoaderCircle className="animate-spin size-5 max-[320px]:size-4"/> 
                : 
              <SendHorizontal className="size-5 max-[320px]:size-4"/>
              }
          </span>
        </button>
      </>}
      </div>
       )
      }
    </div>
  );
}



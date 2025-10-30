"use client";

import Cookies from "js-cookie";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
// import { useAuth, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useGlobalLoading } from "@/app/store/LoadingContext";

// import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import { CredentialResponse } from "@react-oauth/google";

// Socket stuff
import { io, Socket } from "socket.io-client";


interface User {
  UserId: string;
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  about?: string;
  blockedUsers: string[];
  isDeletedFor: string[];
  provider?: string;
  createdAt: string;
}

interface Message {
  _id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt?: string;          // for edited messages
  isEdited?: boolean;          // boolean flag if edited
  deletedFor?: string[];       // array of userIds for "delete for me"
  reactions?: {                // emoji reactions
    emoji: string;
    userIds: string[];
  }[];
  replyTo?: string | null;     // message ID this one replies to
  seenBy?: string[];           // users who have seen the message
  // seen?: boolean;           // users who have seen the message
  // ✨ New fields for uploads
  fileUrl?: string;   // where file/image is stored
  fileType?: string;  // like "image/png" or "application/pdf"
}
// replyTo?: string | null;     // message ID this one replies to

interface ReplyToMessage {
  text?: string; 
  fileUrl?: string; 
  fileType?: string; 
  fileName?: string,
}

interface ChatContextType {
  users: User[];
  messages: Message[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  authUser: User | null;
  replyingTo: ReplyToMessage | null; // for replying to messages
  isPreviewing: boolean;
  // setIsPreviewing: (value: boolean) => void;
  previewingToggle: (value: boolean) => void;
  
  // Sokcet stuff
  onlineUsers: string[];
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;

  // Existing functions
  getUsers: () => Promise<void>;
  addContact: (UserId: string) => Promise<void>;
  // selectUser: (user: User) => void;
  selectUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  signup: (data: unknown) => Promise<void>;
  login: (data: unknown) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  
  // ✨ messages  
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (receiverId: string, text: string, replyTo?: ReplyToMessage, file?: File, fileName?: string) => Promise<void>;
  editMessage: (messageId: string, newText: string, receiverId: string) => Promise<void>;
  forwardMessage: (messageId: string, receiverId: string) => Promise<void>;
  deleteMessage: (messageId: string, receiverId: string, forEveryone?: boolean) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  cancelReply: () => void;
  // replyToMessage: (messageId: string, text: string) => Promise<void>;
  // selectReply: (data: Message) => void;
  selectReply: (messsage: ReplyToMessage ) => void;
  markAsSeen: (messageId: string) => Promise<void>;

  // Profile
  updateUserProfile: (data: unknown) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearChat: (userId: string) => Promise<void>;
  getHiddenOrBlockedUsers: () => Promise<void>;
  restoreUser: (userId: string) => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;


  previewSidebar: (value: boolean) => void;
  hsToggle: boolean;
  
  chatOpen: (value: boolean) => void;
  isChatOpen: boolean;
}

// Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyToMessage | null>(null); // for replying to messages

  // For showing backbutton and layout on small screen
    const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Horizontal sidebar toggle 
  const [hsToggle, setHsToggle] = useState(false);
  
  // For showing online users
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // For socket
  const [socket, setSocket] = useState<Socket | null>(null)

  const { setIsLoading } = useGlobalLoading();

  // const { getToken, isLoaded } = useAuth();


// ============================================================================================================
// USERS RELATED STUFF
// ============================================================================================================

  const getUsers = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    setIsUsersLoading(true);

    try {
      const res = await axiosInstance.get<User[]>("/api/actions/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setIsUsersLoading(false);
    }
  };

  // const addContact = async (UserId: unknown) => {
  const addContact = async (UserId: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    setIsUsersLoading(true);

    try {
      const res = await axiosInstance.post("/api/actions/add-contact", { targetUserId: UserId } ,{
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newContact = res.data.friend; // your backend should return the added friend object

      // ✅ Append the new contact to the existing users list
      setUsers((prevUsers) => [...prevUsers, newContact]);

      toast.success("Contact added successfully!");
    } catch (error: unknown) {
      // console.log( "This is error for adding user ", error );
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to add contact");
    } finally {
      setIsUsersLoading(false);
    }
  };
  
  // Fetch user details
  const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;
  
      try {
        const res = await axiosInstance.get("/api/actions/UserInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthUser(res.data);
        // console.log("✅ User restored from backend:", res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setAuthUser(null);
        Cookies.remove("token");
      }
    };

// ============================================================================================================
// MESSAGES RELATED STUFF
// ============================================================================================================

  const getMessages = async (userId: string) => {
    const token = Cookies.get("token");
    if (!token) return;
    
    setIsMessagesLoading(true);

    try {
      const res = await axiosInstance.get<Message[]>(`/api/actions/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Fetched messages:", res.data);
      
      // lastMessage: messages.length > 0 ? messages[messages.length - 1].text : null,
      // setLastMessage(res.data.length > 0 ? res.data[res.data.length - 1] : null);
      
      setMessages(res.data);
      

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  };


  const sendMessage = async (receiverId: string , text: string, replyTo?: ReplyToMessage, file?: File, fileName?: string,) => {
    const token = Cookies.get("token");
    if (!token) return;
    


    // prevent empty message with no file
    if (!text.trim() && !file) return;
      

    try{
      // ===========================================
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      formData.append("text", text);
      formData.append("fileName", fileName || "");

      // ✅ Fix: Convert object to string before appending
      if (replyTo) formData.append("replyTo", JSON.stringify(replyTo));

      if (file) formData.append("file", file);
      // ===========================================
    const res = await axiosInstance.post("/api/actions/send-message", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

      // 3️⃣ Update local state immediately (optimistic UI)
      const newMessage = res.data.sendedMessage; // your backend should return the message

      // // ✅ Append the new message to the existing messages
      setMessages((prev) => [...prev, newMessage]);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to send messages");
    }

  };

    // ================================================================
  // 📝 Edit Message
  const editMessage = async (messageId: string, newText: string, receiverId: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await axiosInstance.patch(
        `/api/actions/${messageId}/edit`,
        { content: newText , receiverId: receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedMessage = res.data;

      // Update in local state
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
      toast.success("Message edited");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to edit message");
    }
  };

  // ================================================================
  // 🗑️ Delete Message
  // const deleteMessage = async (messageId: string, deleteForEveryone = false, receiverId: string) => {
    const deleteMessage = async (messageId: string, receiverId: string, deleteForEveryone = false) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      await axiosInstance.delete(`/api/actions/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { deleteForEveryone , receiverId  },
      });

      if (deleteForEveryone) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId ? { 
              ...m, text: "🛇 This message was deleted",
               fileUrl: undefined, 
               fileType: undefined, 
               fileName: undefined, 
               replyTo: undefined, 
              } : m
          )
        );
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      }

      toast.success(deleteForEveryone ? "Deleted for everyone" : "Deleted for you");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete message");
    }
  };

  // ================================================================
  // 🔁 Forward Message
  const forwardMessage = async (messageId: string, receiverId: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await axiosInstance.post(
        `/api/actions/forward`,
        { messageId, receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMsg = res.data;
      setMessages((prev) => [...prev, newMsg]);
      toast.success("Message forwarded");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to forward message");
    }
  };

  // ================================================================
  // 😀 React to Message
  const reactToMessage = async (messageId: string, emoji: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await axiosInstance.post(
        `/api/actions/${messageId}/react`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedMessage = res.data;
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to react");
    }
  };

  // ================================================================
  // 👀 Mark Message as Seen
  // const markAsSeen = async (messageId: string) => {
  const markAsSeen = async ( receiverId: string ) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      await axiosInstance.post(
        `/api/actions/seen`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if(!authUser) return;
      setMessages(prev =>
        prev.map(m => {
          // if (m._id !== messageId) return m;

          // ensure seenBy is an array and userId is added only once
          const seenBy = m.seenBy ?? [];
          // if (seenBy.includes(userId)) return m;
          if (seenBy.includes(authUser?._id)) return m;

          return { ...m, seenBy: [...seenBy, authUser?._id] };
        })
      );
      // setMessages((prev) =>
      //   prev.map((m) =>
      //     m._id === messageId ? { ...m, seen: true } : m
      //   )
      // );
    } catch (error) {
      console.error("Failed to mark seen:", error);
    }
  };

  
  
// ============================================================================================================
// AUTHENTICATION RELATED STUFF
// ============================================================================================================

  const checkAuth = async () => {
    
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await axiosInstance.get(`/api/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthUser(res.data);
     // Connecting to socket 
      connectSocket();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to check auth");
    } 
  };

  const signup = async (data: unknown) => {
      setIsLoading(true);
      setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      const token = res.data.token;

      // Save in cookie (for middleware)
      Cookies.set("token", token, { expires: 7, sameSite: "Strict" });

      setAuthUser(res.data);

      toast.success("Account created successfully");

      // Connecting to socket on signup
      connectSocket();

      // 👇 Redirect after signup
      router.push("/Home");

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to sign up");
    } finally {
      setIsSigningUp(false);
      // 👇 Add a delay before hiding
      setTimeout(() => setIsLoading(false), 800);
    } 
  };

  const login = async (data: unknown) => {
    setIsLoading(true);
    setIsLoggingIn(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      const token = res.data.token;

      // Store token
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 7, sameSite: "Strict" });

     // Update user in context
      setAuthUser(res.data.user);

      toast.success("Logged in successfully");

      // Connecting to socket on login
      connectSocket();

      // 👇 Redirect after login
      router.push("/Home");

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to log in");
    } finally {
      setIsLoggingIn(false);
      // 👇 Add a delay before hiding
      setTimeout(() => setIsLoading(false), 800);
    }
  };

// ✅ new google login
  const googleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setIsLoggingIn(true);

    try {
      const token = credentialResponse.credential;
      const { data } = await axiosInstance.post("/api/auth/google", { token });

      localStorage.setItem("token", data.token);
      Cookies.set("token", data.token, { expires: 7, sameSite: "Strict" });

      // setUser(jwtDecode(data.token));
      setAuthUser(data.user);

      // Connecting to socket on login
      connectSocket();

      // 👇 Redirect after login
      router.push("/Home");

      toast.success("Logged in with Google");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "SignUp/Login with google failed");
    } finally {
      setIsLoggingIn(false);
      // 👇 Add a delay before hiding
      setTimeout(() => setIsLoading(false), 800);
    }
  };


  const logout = async () => {
    try {

      await axiosInstance.post("/api/auth/logout");
      toast.success("Logged out successfully");

      // DIsconnecting socket on logout
      disconnectSocket();

      // 🧹 Remove token from everywhere
      localStorage.removeItem("token");
      Cookies.remove("token");
      
      googleLogout();
      // 👇 Redirect after Logout
      router.push("/login");

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to Logout");
    }
  };

  // Selecting REPLY
  const selectReply = (messageObj: ReplyToMessage) => {
    setReplyingTo(messageObj);
  };

  const cancelReply = () => setReplyingTo(null);

  const previewingToggle = (value: boolean) => {
    setIsPreviewing(value);
  }

  // For chat and back button on small screens
  const chatOpen = (value: boolean) => {
    setIsChatOpen(value);
  }
  
  // For horizontal sidebar on small screeen when chat is open don't show it 
  const previewSidebar = (value: boolean) => {
    setHsToggle(value);
  }  

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };

  // ===============================
  //        SOCKET
  // ===============================

  const connectSocket = () => {
    if (!authUser || socket?.connected) return;
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      query: { userId: authUser._id },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      // console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      // console.log("❌ Socket disconnected");
    });
  };

  const disconnectSocket = () => {
    if (socket?.connected) {
      socket.disconnect();
      // console.log("🔌 Socket manually disconnected");
    }
  };


 // ===================================================================================
//                            MESSAGES WITH SOCKET
 // ===================================================================================
 const subscribeToMessages = () => {
    if (!socket || !selectedUser) return;

    // if (authUser) {
    //   markAsSeen(authUser?._id || "");
    // }
    markAsSeen(selectedUser._id);

    const handleNewMessage = (newMessage: Message) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;

      setMessages((prev) => [...prev, newMessage]);
    };

    const handleEditedMessage = (editedMessage: Message) => {
      const isMessageFromSelectedUser = editedMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;

      setMessages((prev) => prev.map((m) => (m._id === editedMessage._id ? editedMessage : m)));
    }

    const handleDeletedForEveryone = (deletedMessage: Message) => {
      const isMessageFromSelectedUser = deletedMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;

      setMessages((prev) => prev.map((m) => (m._id === deletedMessage._id ? deletedMessage : m)));
    }

    // When this user is blocked by someone else
    // const handleBlockedByUser = ({ blockerId }: { blockerId: string }) => {
    // setUsers((prev) =>
    //   prev.map((u) =>
    //     u._id === blockerId ? { ...u, isBlockedByThem: true } : u
    //   )
    // )};

    socket.on("newMessage", handleNewMessage);
    socket.on("editedMessage", handleEditedMessage);
    socket.on("deletedForEveryone", handleDeletedForEveryone);
    // socket.on("blockedByUser", handleBlockedByUser);
    ("Subscribed to new messages");

    // cleanup (in case you re-subscribe)
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("editedMessage", handleEditedMessage);
      socket.off("deletedForEveryone", handleDeletedForEveryone);
      // socket.off("blockedByUser", handleBlockedByUser);
      // console.log("Unsubscribed from new messages");
    };
  };

  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
    socket.off("editedMessage");
    socket.off("deletedForEveryone");
    // socket.off("blockedByUser");
    // console.log("Unsubscribed from newMessage event");
  };

  // ===================================================================================
  //                UPDATE USER PROFILE
  // ===================================================================================

  // const updateUserProfile = async (data: UpdatedProfileData) => {
  const updateUserProfile = async (data: unknown) => {
    const token = Cookies.get("token");
    if (!token) return;
    try {
      const res = await axiosInstance.patch("/api/actions/update-profile", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
         },
      });
      setAuthUser(res.data);
      toast.success("Profile updated successfully");
    }
    catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };
  // ===================================================================================

  // For Blocking user
  const blockUser = async (userId: string) => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.patch(
      `/api/actions/block/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Update local state to reflect blocked user instantly
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isBlocked: true } : u
      )
    );

    toast.success(res.data.message || "User blocked");
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || "Failed to block user");
  }
};

// For Unblocking User
const unblockUser = async (userId: string) => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.patch(
      `/api/actions/unblock/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "User unblocked");
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || "Failed to unblock user");
  }
};

// For Deleting User from sidebar
const deleteUser = async (userId: string) => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.delete(`/api/actions/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Remove the deleted user from local list
    setUsers(prev => prev.filter(user => user._id !== userId));   

    // If the deleted user is currently selected, clear selection
    if ( selectedUser && selectedUser._id === userId ) {
      setSelectedUser(null);
    }

    toast.success("Contact deleted for you");

  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || "Failed to delete account");
  }
};

// Clear Chat
const clearChat = async (userId: string) => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.delete(`/api/actions/clearChat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages([]);
    toast.success("Chat cleared successfully");

  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || "Failed to clear chat");
  }

};

// Get users for Restore-Sidebar
const getHiddenOrBlockedUsers = async () => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.get(`/api/actions/hidden`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // return res.data; // You can store in state if needed
    setUsers(res.data);

  } catch (error) {
    const err = error as AxiosError<{ msg: string }>;
    toast.error(err.response?.data?.msg || "Failed to fetch hidden users");
  }
};

// Restoring the deleted-for-me user
const restoreUser = async (userId: string) => {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await axiosInstance.patch(
      `/api/actions/restore/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if(!(authUser?.blockedUsers?.includes(selectedUser?._id || ""))) {
    // ✅ Remove the user from deleted-for-me list
    setUsers(prev => prev.filter(user => user._id !== userId));   

    // If the deleted user is currently selected, clear selection
    if ( selectedUser && selectedUser._id === userId ) {
      setSelectedUser(null);
    }
  }

    toast.success(res.data.message || "User restored successfully");
    
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || "Failed to restore user");
  }
};



  return (
    <ChatContext.Provider
      value={{
        users,
        onlineUsers,
        socket, // ✅ new
        connectSocket, // ✅ new
        disconnectSocket, // ✅ new
        subscribeToMessages,
        unsubscribeFromMessages,
        messages,
        selectedUser,
        updateUserProfile, // ✅ new
        blockUser, // ✅ new
        unblockUser, // ✅ new
        deleteUser, // ✅ new
        clearChat, // ✅ new
        getHiddenOrBlockedUsers, // ✅ new
        restoreUser, // ✅ new
        googleLogin, // ✅ new
        previewSidebar, // ✅ new
        hsToggle, // ✅ new
        chatOpen, // ✅ new
        isChatOpen, // ✅ new
        // This is some new value added 
        replyingTo,
        setSelectedUser,
        isUsersLoading,
        isMessagesLoading,
        isPreviewing,
        // setIsPreviewing,
        previewingToggle,
        isLoggingIn,
        isSigningUp,
        authUser,
        getUsers,
        addContact,
        getMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        forwardMessage,
        // replyToMessage,
        selectReply,
        cancelReply,
        reactToMessage,
        markAsSeen,
        selectUser,
        checkAuth,
        signup,
        logout,
        login,
        fetchUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook for easy use
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used inside a ChatProvider");
  }
  return context;
};


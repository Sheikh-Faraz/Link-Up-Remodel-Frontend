import "./globals.css";
import { LoadingProvider } from "@/app/store/LoadingContext";
import { ChatProvider } from "@/app/store/Chatinfo";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "Link Up",
  description: "Chat with friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

        <LoadingProvider>
          <ChatProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </ChatProvider>
        </LoadingProvider>
        
      </GoogleOAuthProvider>
      </body>
    </html>
  );
}

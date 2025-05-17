"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProfileDropdown from "@/components/chat/ProfileDropdown";
import Navbar from "@/components/Navbar";
import { ReactNode, useEffect, useState } from "react";
import { getUserEmailFromToken } from "@/lib/auth";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const user_id = getUserEmailFromToken();

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface ChatHistory {
  conversation_id: string;
  chat_title: string;
  created_at: string;
}
export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const token = Cookies.get("token");

  const pathname = usePathname();
  const isAuthPage = ["/login", "/signup"].includes(pathname);
  const adminHome = pathname === "/home";

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log("user_id", user_id);
  const handleFetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseURL}/chat/conversations/${user_id}`);

      setChatHistory(res.data.data.conversations);
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to fetch chat history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchChatHistory();
  }, []);

  return (
    <>
      {!isAuthPage && (
        <div className="hidden md:block md:p-4 md:self-start md:h-[100dvh]">
          <Sidebar chatHistory={chatHistory} isLoading={isLoading} />
        </div>
      )}

      <div className="flex flex-col w-full h-screen">
        {!isAuthPage && (
          <header
            className={`hidden md:flex ${
              adminHome ? "justify-between" : "justify-end"
            } items-center px-6 py-4 relative`}
          >
            {adminHome && (
              <h2 className="text-black font-medium text-[26px] md:text-[32px]">
                Overview
              </h2>
            )}
            <ProfileDropdown email={user_id ?? ""} />
          </header>
        )}

        {!isAuthPage && (
          <header className="block w-full md:hidden">
            <Navbar chatHistory={chatHistory} isLoading={isLoading} />
          </header>
        )}

        <main
          className={`max-sm:p-4 w-full ${
            isAuthPage ? "h-screen" : "h-screen-minus-80"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}

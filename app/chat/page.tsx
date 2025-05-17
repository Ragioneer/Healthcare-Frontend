"use client";

import { useState, useRef, useEffect } from "react";
import { apiPost } from "@/lib/api";
import { getUserEmailFromToken } from "@/lib/auth";
import CustomInput from "@/components/chat/CustomInput";

interface ChatResponse {
  reply: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const user_id = getUserEmailFromToken();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const res = await apiPost<ChatResponse>("/chat", {
        messages: newMessages,
        user_id,
      });

      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } catch (error) {
      console.error("Chat error", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-[624px] flex flex-col items-center justify-center">
        <h1 className="text-primary font-medium text-[28px] md:text-[32px] text-center mb-4">
          Crohn or Colitis? <br /> Get answers from our AI
        </h1>
        <CustomInput handleSubmit={handleSend} loader={false} />
      </div>
    </div>
  );
}

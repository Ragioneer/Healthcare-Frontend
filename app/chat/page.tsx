"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiPost } from "@/lib/api";
import { getUserEmailFromToken } from "@/lib/auth";

interface ChatResponse {
  reply: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const user_id = getUserEmailFromToken();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          💬 MediQuick AI Chat
        </h2>

        <Card className="flex-1 min-h-[60vh] max-h-[70vh] overflow-y-auto p-4 shadow-lg rounded-xl bg-white">
          <CardContent className="space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </CardContent>
        </Card>

        <div className="flex gap-2 items-center">
          <Input
            className="flex-1 rounded-xl shadow-md text-black placeholder-gray-400"
            placeholder="Describe your symptoms or ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button
            className="rounded-xl px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

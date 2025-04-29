"use client"; // <-- Add this because we are using browser state

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiPost } from "@/lib/api";

interface ChatResponse {
  reply: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  async function handleSend() {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await apiPost<ChatResponse>("/chat", {
        messages: newMessages,
        user_id: "user-123", // ➔ Replace with real user ID later
      });

      // Add assistant reply
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } catch (error) {
      console.error("Chat error", error);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-72 bg-slate-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Chat</h2>
        <ul className="flex flex-col gap-2">
          <li className="bg-white px-3 py-2 rounded shadow">Headache advice</li>
          <li className="bg-white px-3 py-2 rounded shadow">Test booking</li>
          <li className="bg-white px-3 py-2 rounded shadow">Fever symptoms</li>
        </ul>
      </div>

      <div className="flex-1 bg-white p-6 flex flex-col">
        <Card className="flex-1 p-4 mb-4 overflow-y-auto">
          <CardContent className="space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded ${m.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}
              >
                {m.content}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Input
            placeholder="Describe your symptoms or ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}

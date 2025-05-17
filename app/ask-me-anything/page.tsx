"use client";

import { useState, useRef, useEffect } from "react";
import CustomInput from "@/components/chat/CustomInput";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useClient } from "@/context/ClientContext";
import { getUserEmailFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import axios from "axios";

const whatsapp_url = process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_LINK;
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface ChatResponse {
  data: { reply: string };
}

interface NewChatResponse {
  data: { conversation_id: string; chat_title: string };
}

const suggestions = [
  "Can I travel if I have Crohn's disease?",
  "What foods should I avoid with ulcerative colitis?",
  "Is fatigue a symptom of IBD?",
];

const AskMeAnything = () => {
  const client = useClient();
  const router = useRouter();

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      setIsLoading(true);
      const chatRes: NewChatResponse = await axios.post(`${baseURL}/chat/new`, {
        user_id,
      });
      await axios.post(`${baseURL}/chat`, {
        messages: newMessages,
        user_id,
        conversation_id: chatRes?.data?.conversation_id,
      });

      router.push(`/ask-me-anything/${chatRes?.data?.conversation_id}`);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-full w-full max-w-[624px] flex flex-col items-center justify-center space-y-16">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary rounded-full p-2">
              <Image
                src={"/images/mefIA/mefIALogoCollapsedLogo.png"}
                height={48}
                width={48}
                alt="logo"
              />
            </div>

            <h1 className="text-[#263238] font-semibold text-[18px] md:text-[24px] leading-[26px] text-center mb-4">
              Crohn or Colitis? Get answers from our AI.
            </h1>

            <p className="text-[14px] md:text-[16px] text-[#747474] text-center leading-[20px]">
              Our AI assistant is trained in IBD care.
              <br />
              Get answers about symptoms, treatment, or lifestyle — instantly.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => setSelectedSuggestion(suggestion)}
                className="h-[40px] md:h-[96px] border border-[#EBE9FF] text-[#747474] px-[20px] py-[16px] text-[14px] flex items-center justify-center cursor-pointer rounded-2xl shadow-[0px_4px_20px_0px_#00000033]"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center space-y-6">
          <CustomInput
            handleSubmit={handleSend}
            loader={isLoading}
            selectedSuggestion={selectedSuggestion}
          />

          <Button
            variant={"default"}
            className="w-fit h-[50px] px-4 py-2 font-semibold border border-primary"
            onClick={() => {
              if (whatsapp_url) {
                window.open(whatsapp_url, "_blank");
              }
            }}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskMeAnything;

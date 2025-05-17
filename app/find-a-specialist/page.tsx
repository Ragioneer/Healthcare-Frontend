"use client";

import { useState } from "react";
import { getUserEmailFromToken } from "@/lib/auth";
import CustomInput from "@/components/chat/CustomInput";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import SpecialistChatContainer from "@/components/specialist/SpecialistChatContainer";

const whatsapp_url = process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_LINK;
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const suggestions = [
  "Can you help me find a gastroenterologist near me?",
  "Can I get a referral for a nutritionist?",
  "I’ve just been diagnosed — where should I start?",
];

const FindASpecialist = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const user_id = getUserEmailFromToken();

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    console.log("base url:", baseURL);
    try {
      setIsLoading(true);
      const res: { data: { reply: string } } = await axios.post(
        `${baseURL}/chat/find-specialist`,
        input
      );

      console.log("res:", res);
      setMessages([
        ...newMessages,
        { role: "assistant", content: res?.data.reply },
      ]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-full">
      {messages.length > 1 ? (
        <SpecialistChatContainer
          messages={messages}
          loadingMessages={isLoading}
          handleSubmit={handleSend}
        />
      ) : (
        <div className="h-full w-full max-w-[624px] flex flex-col items-center justify-center space-y-16">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={"/images/nudii/collapsedNudiiLogo.png"}
                height={48}
                width={48}
                alt="logo"
              />
              <h1 className="text-[#263238] font-semibold text-[20px] md:text-[24px] leading-[16px] md:leading-[26px] text-center mb-4">
                Find a specialist
              </h1>

              <p className="text-[12px] md:text-[16px] text-[#747474] text-center leading-[10px] md:leading-[20px]">
                Let our AI guide your request.
                <br />
                We’ll forward it to a human who can match you with the right
                doctor.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="h-[96px] border border-[#EBE9FF] text-[#747474] px-[20px] py-[16px] text-[10px] md:text-[14px] flex items-center justify-center rounded-2xl"
                  style={{
                    boxShadow: "0px 4px 20px 0px #00000033",
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <CustomInput handleSubmit={handleSend} loader={isLoading} />

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
      )}
    </div>
  );
};

export default FindASpecialist;

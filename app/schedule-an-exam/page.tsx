"use client";

import { useState, useRef, useEffect } from "react";
import { apiPost } from "@/lib/api";
import { getUserEmailFromToken } from "@/lib/auth";
import CustomInput from "@/components/chat/CustomInput";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChatResponse {
  reply: string;
}

const whatsapp_url = process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_LINK;

const suggestions = [
  "Can I book a colonoscopy through NuDii?",
  "How do I schedule a CT scan for my gut?",
  "Where can I do a fecal calprotectin test?",
];

const ScheduleAnExam = () => {
  return (
    <div className="flex items-center justify-center h-full">
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
              Need help scheduling a exam?
            </h1>

            <p className="text-[12px] md:text-[16px] text-[#747474] text-center leading-[10px] md:leading-[20px]">
              {/* Our AI collects your exam needs.
              <br /> */}
              We’ll pass them to our concierge to help you book the right test.
            </p>
          </div>

          {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div> */}
        </div>

        <div className="w-full flex flex-col items-center justify-center space-y-6">
          {/* <CustomInput handleSubmit={handleSend} loader={false} /> */}

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

export default ScheduleAnExam;

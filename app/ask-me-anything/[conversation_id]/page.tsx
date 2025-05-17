"use client";

import ChatContainer from "@/components/chat/ChatContainer";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const SingleChat = ({
  params,
}: {
  params: {
    conversation_id: string;
  };
}) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
    // [
    //   { role: "user", content: "Hello, how can I help you today?" },
    //   {
    //     role: "assistant",
    //     content:
    //       "Hi there! I'm here to help you with any questions or concerns you may have. What can I assist you with today?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm looking for a nutritionist in my area. Can you help me find one?",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Sure, I can help you with that. What is your specific area of interest?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm interested in finding a nutritionist who specializes in diabetes management.",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Great! I found a few nutritionists who specialize in diabetes management. Do you have any other specific requirements or preferences?",
    //   },
    //   { role: "user", content: "Hello, how can I help you today?" },
    //   {
    //     role: "assistant",
    //     content:
    //       "Hi there! I'm here to help you with any questions or concerns you may have. What can I assist you with today?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm looking for a nutritionist in my area. Can you help me find one?",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Sure, I can help you with that. What is your specific area of interest?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm interested in finding a nutritionist who specializes in diabetes management.",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Great! I found a few nutritionists who specialize in diabetes management. Do you have any other specific requirements or preferences?",
    //   },
    //   { role: "user", content: "Hello, how can I help you today?" },
    //   {
    //     role: "assistant",
    //     content:
    //       "Hi there! I'm here to help you with any questions or concerns you may have. What can I assist you with today?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm looking for a nutritionist in my area. Can you help me find one?",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Sure, I can help you with that. What is your specific area of interest?",
    //   },
    //   {
    //     role: "user",
    //     content:
    //       "I'm interested in finding a nutritionist who specializes in diabetes management.",
    //   },
    //   {
    //     role: "assistant",
    //     content:
    //       "Great! I found a few nutritionists who specialize in diabetes management. Do you have any other specific requirements or preferences?",
    //   },
    // ]
  );
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [user_id, setUserId] = useState("");

  const handleFetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res: {
        data: {
          _id: string;
          user_id: string;
          conversation_id: string;
          chat_title: string;
          created_at: string;
          last_updated: string;
          messages: { role: string; content: string; timestamp: string }[];
        };
      } = await axios.get(`${baseURL}/chat/history/${params.conversation_id}`);

      setMessages(res?.data.messages);
      setUserId(res?.data?.user_id ?? "");
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error! Failed to fetch messages. Please try again.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    handleFetchMessages();
  }, []);
  return (
    <div className="h-screen-minus-100 w-full flex flex-col">
      <ChatContainer
        messages={messages}
        setMessages={setMessages}
        loadingMessages={loadingMessages}
        conversation_id={params.conversation_id}
        user_id={user_id}
      />
    </div>
  );
};

export default SingleChat;

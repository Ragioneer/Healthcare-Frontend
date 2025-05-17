import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
} from "react";
import CustomInput from "./CustomInput";
import Image from "next/image";
import { toast } from "react-toastify";
import { ChatResponse } from "@/app/ask-me-anything/page";
import { apiPost } from "@/lib/api";
import CustomMarkdown from "../CustomMarkdown";

type ChatContainerProps = {
  messages: { role: string; content: string }[];
  setMessages: Dispatch<
    SetStateAction<
      {
        role: string;
        content: string;
      }[]
    >
  >;
  loadingMessages: boolean;
  user_id: string;
  conversation_id: string;
};

const ChatContainer: FC<ChatContainerProps> = ({
  messages,
  setMessages,
  loadingMessages,
  user_id,
  conversation_id,
}) => {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [lastStreamedIndex, setLastStreamedIndex] = useState<number>(-1);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Analyzing...");
  const [responseLoading, setResponseLoading] = useState<boolean>(false);

  const isUserAtBottom = useCallback(() => {
    if (!scrollableDivRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollableDivRef.current && isUserAtBottom()) {
      scrollableDivRef.current.scrollTo({
        top: scrollableDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isUserAtBottom]);

  const handleSubmit = async (inputText: string) => {
    try {
      const newMessages = [...messages, { role: "user", content: inputText }];
      setMessages(newMessages);

      const res = await apiPost<ChatResponse>("/chat", {
        messages: newMessages,
        user_id,
        conversation_id,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      setResponseLoading(true);
    } catch (error) {
      toast.error("Error! Failed to send message. Please try again.");
    } finally {
      setResponseLoading(false);
    }
  };

  // Scroll handling
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Streaming effect
  useEffect(() => {
    const newIndex = messages.length - 1;
    const newMessage = messages[newIndex];

    if (newIndex <= lastStreamedIndex || newMessage?.role !== "assistant")
      return;

    const fullText = newMessage.content;
    let currentIndex = 0;
    let intervalId: NodeJS.Timeout;

    const streamText = () => {
      setIsStreaming(true);
      setStreamingContent("");

      intervalId = setInterval(() => {
        currentIndex += 4;
        setStreamingContent((prev) => {
          const newContent = fullText.slice(0, currentIndex);
          if (newContent.length >= fullText.length) {
            clearInterval(intervalId);
            setIsStreaming(false);
            setLastStreamedIndex(newIndex);
          }
          return newContent;
        });
      }, 20);

      return () => clearInterval(intervalId);
    };

    streamText();

    return () => {
      clearInterval(intervalId);
      setIsStreaming(false);
    };
  }, [messages, lastStreamedIndex]);

  // Loading text animation
  useEffect(() => {
    if (responseLoading) {
      const timer = setTimeout(() => {
        setLoadingText("Thinking...");
      }, 2000);
      return () => clearTimeout(timer);
    }
    setLoadingText("Analyzing...");
  }, [responseLoading]);

  return (
    <div className="h-full flex flex-col-reverse justify-center items-center xl:items-start gap-2 px-2 md:px-4 xl:px-0 xl:flex-row w-full">
      <div className="h-full flex flex-col w-full md:w-[776px] overflow-hidden">
        <div
          className="p-2 md:p-4 overflow-y-auto flex-1 custom-scrollbar"
          ref={scrollableDivRef}
        >
          {loadingMessages && messages.length === 0 && <LoadingSpinner />}

          {!loadingMessages &&
            messages.map((message, index) => (
              <MessageItem
                key={index}
                message={message}
                index={index}
                messagesLength={messages.length}
                lastStreamedIndex={lastStreamedIndex}
                streamingContent={streamingContent}
                isStreaming={isStreaming}
              />
            ))}

          {responseLoading && <LoadingIndicator loadingText={loadingText} />}
        </div>

        <div className="justify-self-end">
          <CustomInput
            handleSubmit={handleSubmit}
            loader={loadingMessages || responseLoading}
          />
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = memo(() => (
  <div role="status" className="w-full h-full flex items-center justify-center">
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ... SVG path remains same ... */}
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
));

const MessageItem = memo(
  ({
    message,
    index,
    messagesLength,
    lastStreamedIndex,
    streamingContent,
    isStreaming,
  }: {
    message: { role: string; content: string };
    index: number;
    messagesLength: number;
    lastStreamedIndex: number;
    streamingContent: string;
    isStreaming: boolean;
  }) => (
    <div
      className={`flex mb-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-full ${
          message.role === "user"
            ? "bg-[#EFF6FF] text-[#212529] rounded-2xl p-3"
            : "#041C3E"
        }`}
      >
        {message.role === "assistant" && (
          <div className="flex items-center gap-2">
            <Image
              src="/images/mefIA/mefIALogoCollapsedLogo.png"
              alt="Assistant"
              height={48}
              width={48}
              className="bg-[#EFF6FF] p-2 h-[32px] w-[32px] md:h-[48px] md:w-[48px] object-contain rounded-full mb-2"
            />
            {isStreaming && (
              <p className="text-[12px] md:text-[16px] leading-[18px] text-[#041C3E]">
                Answering...
              </p>
            )}
          </div>
        )}
        <CustomMarkdown>
          {index === messagesLength - 1 &&
          index > lastStreamedIndex &&
          message.role === "assistant"
            ? streamingContent
            : message.content}
        </CustomMarkdown>
      </div>
    </div>
  )
);

const LoadingIndicator = memo(({ loadingText }: { loadingText: string }) => (
  <div className="flex items-center gap-2">
    <Image
      src="/images/mefIA/lefIALogoCollapsedLogo.png"
      alt="Loading"
      height={48}
      width={48}
      className="bg-[#EAF4FE] p-2 h-[32px] w-[32px] md:h-[48px] md:w-[48px] object-contain rounded-full mb-2 animate-pulse"
    />
    <p className="text-[12px] md:text-[16px] leading-[18px] text-[#041C3E]">
      {loadingText}
    </p>
  </div>
));

export default ChatContainer;

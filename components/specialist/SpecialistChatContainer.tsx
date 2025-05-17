import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  Dispatch,
  SetStateAction,
} from "react";
import CustomInput from "../chat/CustomInput";
import Image from "next/image";
import CustomMarkdown from "../CustomMarkdown";
import axios from "axios";
import Loader from "../ui/Loader";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

type SpecialistChatContainerProps = {
  messages: { role: string; content: string }[];
  setMessages: Dispatch<SetStateAction<{ role: string; content: string }[]>>;
  loadingMessages: boolean;
};

const SpecialistChatContainer: FC<SpecialistChatContainerProps> = ({
  messages,
  setMessages,
  loadingMessages,
}) => {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [lastStreamedIndex, setLastStreamedIndex] = useState<number>(-1);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>(
    "Reviewing your symptoms..."
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      setIsLoading(true);
      const res: { data: { reply: string } } = await axios.post(
        `${baseURL}/chat/find-specialist`,
        input
      );
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
          const newContent = fullText?.slice(0, currentIndex);
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
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingText("Reviewing your symptoms...");
      }, 2000);
      return () => clearTimeout(timer);
    }
    setLoadingText("Matching you with a specialist...");
  }, [isLoading]);

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
                loadingText={loadingText}
              />
            ))}

          {isLoading && <LoadingIndicator loadingText={loadingText} />}
        </div>

        <div className="justify-self-end">
          <CustomInput
            handleSubmit={handleSend}
            loader={loadingMessages || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = memo(() => (
  <div role="status" className="w-full h-full flex items-center justify-center">
    <Loader />
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
    loadingText,
  }: {
    message: { role: string; content: string };
    index: number;
    messagesLength: number;
    lastStreamedIndex: number;
    streamingContent: string;
    isStreaming: boolean;
    loadingText: string;
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
            <span className="bg-primary rounded-full p-2 mb-2">
              <Image
                src="/images/mefIA/mefIALogoCollapsedLogo.png"
                alt="Assistant"
                height={48}
                width={48}
                className="h-[32px] w-[32px] md:h-[48px] md:w-[48px] object-contain rounded-full"
              />
            </span>
            {isStreaming && (
              <p className="text-[12px] md:text-[16px] leading-[18px] text-[#041C3E]">
                {loadingText}
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
    <span className="bg-primary rounded-full p-2 mb-2">
      <Image
        src="/images/mefIA/mefIALogoCollapsedLogo.png"
        alt="Assistant"
        height={48}
        width={48}
        className="h-[32px] w-[32px] md:h-[48px] md:w-[48px] object-contain rounded-full"
      />
    </span>
    <p className="text-[12px] md:text-[16px] leading-[18px] text-[#041C3E]">
      {loadingText}
    </p>
  </div>
));

export default SpecialistChatContainer;

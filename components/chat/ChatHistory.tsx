import Link from "next/link";
import { ChatHistory } from "../LayoutWrapper";
import { HiBars3BottomLeft } from "react-icons/hi2";
import Loader from "../ui/Loader";

type ChatHistoryProps = {
  chatHistory: ChatHistory[];
  isLoading: boolean;
};
const ChatHistoryContainer = ({ chatHistory, isLoading }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <label className="text-white font-semi-bold">Chat History</label>
        <div className="w-full relative max-h-[300px] custom-scrollbar overflow-y-auto">
          {isLoading ? (
            <div className="w-full flex items-center justify-center mt-4">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col gap-y-6 p-4">
              {chatHistory.map((chat, index) => (
                <Link
                  key={index}
                  href={`/ask-me-anything/${chat.conversation_id}`}
                  onClick={() => {
                    sessionStorage.setItem("dont_stream", "true");
                  }}
                  className="cursor-pointer"
                >
                  <div
                    key={index}
                    className="w-full text-white flex items-center gap-x-2 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
                  >
                    <HiBars3BottomLeft size={20} />
                    <label>{chat.chat_title}</label>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryContainer;

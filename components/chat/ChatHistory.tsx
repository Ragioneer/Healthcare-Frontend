import Link from "next/link";
import { ChatHistory } from "../LayoutWrapper";
import { HiBars3BottomLeft } from "react-icons/hi2";
import Loader from "../ui/Loader";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Dispatch, SetStateAction } from "react";

type ChatHistoryProps = {
  chatHistory: ChatHistory[];
  isLoading: boolean;
  isCollapsed?: boolean;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
};
const ChatHistoryContainer = ({
  chatHistory,
  isLoading,
  isCollapsed,
  setExpanded,
}: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      {isCollapsed ? (
        <span
          onClick={() => {
            if (setExpanded) {
              setExpanded(true);
            }
          }}
          className={`${
            isCollapsed ? "" : "w-full"
          } flex items-center mr-6 justify-center py-4rounded-full gap-2  duration-200 transition-colors text-sm font-medium`}
        >
          <IoChatbubbleEllipsesOutline />
        </span>
      ) : (
        <div>
          <label className="text-white font-semi-bold">Chat History</label>
          <div className="w-full relative max-h-[300px] custom-scrollbar overflow-y-auto">
            {isLoading ? (
              <div className="w-full flex items-center justify-center mt-4">
                <Loader />
              </div>
            ) : (
              <>
                {chatHistory.length > 0 ? (
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
                ) : (
                  <p className="text-white text-center text-sm italic mt-8">
                    No chat history found!
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryContainer;

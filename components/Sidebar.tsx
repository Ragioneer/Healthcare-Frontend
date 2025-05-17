"use client";

import { useClient } from "@/context/ClientContext";
import {
  Beaker,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  Pencil,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { LuBeaker, LuSettings } from "react-icons/lu";
import { ChatHistory } from "./LayoutWrapper";
import ChatHistoryContainer from "./chat/ChatHistory";

type SidebarProps = {
  chatHistory: ChatHistory[];
  isLoading: boolean;
};
// const medIASidebarItems = [
//   {
//     href: "/chat",
//     label: "New Chat",
//     icon: <MessageCircleMore size={20} />,
//   },
//   {
//     href: "/appointments",
//     label: "Schedule Appointment",
//     icon: <Calendar size={20} />,
//   },
//   {
//     href: "/reception",
//     label: "Talk to Receptionist",
//     icon: <Phone size={20} />,
//   },
//   {
//     href: "/exams",
//     label: "Book Lab Exam",
//     icon: <Beaker size={20} />,
//   },
//   {
//     href: "/quote",
//     label: "Get Quotation",
//     icon: <Pencil size={20} />,
//   },
// ];

// const nudiiSidebarItems = [

// ];

const sidebarItems = [
  {
    href: "/ask-me-anything",
    label: "Ask me anything",
    icon: <MessageCircleMore size={20} />,
  },
  {
    href: "/find-a-specialist",
    label: "Find a specialist",
    icon: <FiUsers size={20} />,
  },
  {
    href: "/schedule-an-exam",
    label: "Schedule an exam",
    icon: <LuBeaker size={20} />,
  },
  {
    href: "/clinical-research",
    label: "Apply for clinical Research",
    icon: <Pencil size={20} />,
  },
];

const adminSidebarItems = [
  // {
  //   href: "admin/home",
  //   label: "Home",
  //   icon: <LuSettings size={20} />,
  // },
  {
    href: "/admin/upload-medical-files",
    label: "Upload Medical Files",
    icon: <Pencil size={20} />,
  },
  {
    href: "/admin/ingest-url",
    label: "Ingest URL's",
    icon: <FiCalendar size={20} />,
  },
  {
    href: "/admin/llm-settings",
    label: "LLM Settings",
    icon: <LuSettings size={20} />,
  },
];

const Sidebar: FC<SidebarProps> = ({ chatHistory, isLoading }) => {
  const pathname = usePathname();
  const [expandSidebar, setExpandSidebar] = useState<boolean>(true);

  console.log("pathname: ", pathname);
  const client = useClient();

  const hideSidebar =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const isAdmin = pathname.startsWith("/admin");
  const adminItems = isAdmin ? adminSidebarItems : [];

  if (hideSidebar) return null;
  return (
    <aside
      className={`h-full relative bg-primary flex flex-col gap-6 rounded-2xl shadow-lg transition-[width] duration-300 ease-in-out ${
        expandSidebar ? "w-[288px] pl-6 py-6" : "w-[100px] p-6"
      }`}
    >
      {expandSidebar ? (
        <Image
          src={"/images/mefIA/mefIAWhiteLogo.png"}
          height={66}
          width={160}
          alt="logo"
          priority
        />
      ) : (
        <Image
          src={"/images/mefIA/mefIALogoCollapsedLogo.png"}
          height={66}
          width={66}
          alt="logo"
          priority
        />
      )}

      <div
        onClick={() => setExpandSidebar((prev) => !prev)}
        className={`bg-primary w-fit rounded-full text-white p-[4px] absolute right-[-20px] top-9 cursor-pointer z-99 border-[6px] ${
          client === "nudii" ? "border-secondary" : "border-[#DEE7EC]"
        }`}
      >
        {expandSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </div>
      <div className="flex flex-col gap-y-8">
        <nav className="flex flex-col space-y-[16px] mt-4">
          {isAdmin
            ? adminItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={expandSidebar ? item.label : ""}
                  selected={pathname.startsWith(item.href)}
                  icon={item.icon}
                  expanded={expandSidebar}
                  setExpanded={setExpandSidebar}
                />
              ))
            : sidebarItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={expandSidebar ? item.label : ""}
                  selected={pathname.startsWith(item.href)}
                  icon={item.icon}
                  expanded={expandSidebar}
                  setExpanded={setExpandSidebar}
                />
              ))}
        </nav>

        <ChatHistoryContainer
          chatHistory={chatHistory}
          isLoading={isLoading}
          isCollapsed={!expandSidebar}
          setExpanded={setExpandSidebar}
        />
      </div>
    </aside>
  );
};

export default Sidebar;

export function SidebarLink({
  href,
  label,
  selected,
  icon,
  expanded,
  setExpanded,
}: {
  href: string;
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const client = useClient();

  return (
    <div className="w-full relative">
      <Link
        href={href}
        onClick={() => setExpanded(true)}
        className={`${expanded ? "" : "w-full"} flex items-center mr-6 ${
          label.length > 0 ? "px-5 py-2" : " justify-center py-4"
        } rounded-full gap-2 ${
          selected
            ? "text-primary bg-white border border-white hover:text-white hover:bg-primary ${client === 'nudii' ? 'hover:border-white' : 'hover:border-[#CCD9E1]'}"
            : `text-white border ${
                client === "nudii" ? "border-white" : "border-[#CCD9E1]"
              } hover:text-primary hover:bg-white`
        } duration-200 transition-colors text-sm font-medium`}
      >
        {icon} {label}
      </Link>

      {selected && expanded && (
        <div
          className={`h-full w-[4px] ${
            client === "nudii" ? "bg-[#CCC8FF]" : "bg-white"
          } absolute right-0 top-0 rounded-tl-full rounded-bl-full`}
        />
      )}
    </div>
  );
}

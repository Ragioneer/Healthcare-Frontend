"use client";

import { useClient } from "@/context/ClientContext";
import {
  Beaker,
  Calendar,
  MessageCircleMore,
  Pencil,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { LuBeaker, LuSettings } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { SidebarLink } from "./Sidebar";
import { CiLogout } from "react-icons/ci";
import { ChatHistory } from "./LayoutWrapper";
import ChatHistoryContainer from "./chat/ChatHistory";

type NavbarProps = {
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

const navbarItems = [
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
  //   href: "/admin/home",
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

const Navbar: FC<NavbarProps> = ({ chatHistory, isLoading }) => {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const client = useClient();
  const router = useRouter();

  const hideNavbar =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const isAdmin = pathname.startsWith("/admin");
  const adminItems = isAdmin ? adminSidebarItems : [];

  const handleLogout = () => {
    router.push("/login");
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  if (hideNavbar) return null;
  return (
    <>
      <div className="relative w-full bg-primary py-2 px-4 shadow-lg z-20">
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => {
              setShowSidebar(false);
              document.body.classList.remove("overflow-hidden");
            }}
          />
        )}
        <div className="flex items-center justify-between w-full py-2">
          <Image
            src={"/images/mefIA/mefIAWhiteLogo.png"}
            height={66}
            width={160}
            alt="logo"
            priority
          />
          <FaBars
            size={32}
            onClick={() => {
              setShowSidebar(true);
              document.body.classList.add("overflow-hidden");
            }}
            color="#fff"
            className="cursor-pointer"
          />
        </div>
      </div>

      <div
        className={`fixed top-[0px] left-0 h-full py-4 w-[65%] bg-primary flex flex-col justify-between z-30 rounded-tr-2xl rounded-br-2xl shadow-lg transform transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col justify-between items-center h-full">
          <div className="h-full flex flex-col space-y-[16px]">
            <div className="flex items-center justify-between w-full px-2 pb-4">
              <Image
                src={"/images/mefIA/mefIAWhiteLogo.png"}
                height={66}
                width={160}
                alt="logo"
                priority
              />
              <RxCross2
                size={32}
                onClick={() => {
                  setShowSidebar(false);
                  document.body.classList.remove("overflow-hidden");
                }}
                color="#fff"
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-y-8">
              {isAdmin
                ? adminItems.map((item) => (
                    <span key={item.href} onClick={() => setShowSidebar(false)}>
                      <SidebarLink
                        href={item.href}
                        label={item.label}
                        selected={pathname.startsWith(item.href)}
                        icon={item.icon}
                        expanded={true}
                      />
                    </span>
                  ))
                : navbarItems.map((item) => (
                    <span key={item.href} onClick={() => setShowSidebar(false)}>
                      <SidebarLink
                        href={item.href}
                        label={item.label}
                        selected={pathname.startsWith(item.href)}
                        icon={item.icon}
                        expanded={true}
                      />
                    </span>
                  ))}
              <ChatHistoryContainer
                chatHistory={chatHistory}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div
            onClick={handleLogout}
            className="flex items-center justify-center text-white gap-x-4 w-full"
          >
            Logout <CiLogout size={20} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

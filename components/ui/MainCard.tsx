"use client";
import { FC, ReactNode } from "react";
import { Button } from "./button";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useClient } from "@/context/ClientContext";
import Loader from "./Loader";

type MainCardProps = {
  headerText: string;
  headerIcon?: ReactNode;
  buttonText: string;
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  onSubmit: () => void;
  children: ReactNode;
  isLoading?: boolean;
};
const MainCard: FC<MainCardProps> = ({
  headerText,
  headerIcon,
  buttonText,
  buttonVariant,
  onSubmit,
  children,
  isLoading,
}) => {
  const client = useClient();
  return (
    <div
      className={`w-full max-h-[80dvh] max-w-[528px] flex flex-col rounded-2xl ${
        client === "nudii"
          ? "bg-[#F7F7FF] text-white"
          : "bg-[#F0F9F9] space-y-4"
      }`}
    >
      <div className="flex items-center gap-x-2 bg-primary text-[16px] md:text-[20px] text-white rounded-tl-2xl rounded-tr-2xl px-8 py-4">
        {headerIcon && headerIcon} {headerText}
      </div>
      <div className="p-4">
        {children}

        <Button
          variant={buttonVariant ? buttonVariant : "default"}
          onClick={onSubmit}
          className={`w-full h-[44px] ${
            client === "nudii" ? "text-[#F0F5F8]" : "text-white"
          } px-4 py-2 font-semibold`}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {buttonText}{" "}
              {headerText === "Schedule Your Appointment" ? (
                <ArrowDown />
              ) : (
                <ArrowRight />
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MainCard;

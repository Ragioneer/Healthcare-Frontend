import { Doctor } from "@/app/appointments/page";
import Image from "next/image";
import React, { FC, ReactNode } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import ConfirmationStepper from "./ConfirmationStepper";
import CustomCalendar from "./CustomCalendar";

interface AppointmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export type Step = {
  label: string;
  icon: ReactNode;
};

const steps: Step[] = [
  {
    label: "Date",
    icon: <Calendar size={20} />,
  },
  {
    label: "Time",
    icon: <Clock size={20} />,
  },
  {
    label: "Enter Information",
    icon: <Users size={20} />,
  },
];
const AppointmentConfirmationModal: FC<AppointmentConfirmationModalProps> = ({
  isOpen,
  onClose,
  doctor,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg h-full max-h-[612px] shadow-lg w-full max-w-[900px] relative py-5 px-8">
        <div className="flex justify-end items-center">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="pb-4 w-full flex items-center justify-around gap-x-2">
          <div className="w-[30%] h-full flex flex-col gap-y-4 border-r border-[#E6EDED]">
            <div className="border-b border-[#E6EDED] pb-8">
              <Image
                src={"/images/mefIA/mefIALogo.png"}
                alt="logo"
                height={66}
                width={160}
              />
            </div>
            <div className="w-full flex items-center py-2 gap-6">
              <Image
                src={
                  doctor?.image
                    ? doctor?.image
                    : "/images/mefIA/mefIALogoCollapsedLogo.png"
                }
                className={`${
                  doctor?.image ? "rounded-full" : "bg-primary rounded-full p-2"
                }`}
                height={56}
                width={56}
                alt={doctor?.name ?? "name"}
              />

              <div className="flex flex-col">
                <p className="text-[12px] md:text-[14px] text-[#767676]">
                  {doctor?.specialization ?? "N/A"}
                </p>

                <h2 className="font-semibold text-[18px] md:text-[22px] text-[#242424]">
                  {doctor?.name}
                </h2>
              </div>
            </div>

            <ConfirmationStepper steps={steps} currentStep={0} />
          </div>

          <div className="w-[70%] h-full flex flex-col gap-y-4">
            <h2 className="font-semibold text-[20px] md:text-[24px] text-primary">
              Select date & time
            </h2>
            <CustomCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmationModal;

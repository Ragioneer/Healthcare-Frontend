import Image from "next/image";
import React, { FC } from "react";

type DoctorCardProps = {
  image?: string;
  name: string;
  specialization: string;
};
const DoctorCard: FC<DoctorCardProps> = ({ image, name, specialization }) => {
  return (
    <div className="w-full flex items-center bg-white rounded-[8px] py-2 px-4 gap-6 cursor-pointer hover:scale-105 transition-all duration-300">
      <Image
        src={image ? image : "/images/mefIA/mefIALogoCollapsedLogo.png"}
        className={`${image ? "rounded-[6px]" : "bg-primary rounded-[6px]"}`}
        height={56}
        width={56}
        alt={name}
      />

      <div className="flex flex-col">
        <h2 className="font-semibold text-[14px] md:text-[16px] text-[#242424]">
          {name}
        </h2>
        <p className="text-[12px] md:text-[14px] text-[#767676]">
          {specialization}
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;

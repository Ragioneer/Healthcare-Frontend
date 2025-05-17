import Image from "next/image";
import React, { FC } from "react";
import { GoArrowDown, GoArrowUp, GoArrowUpRight } from "react-icons/go";

type StatCardProps = {
  title: string;
  number: number;
  netValue: number;
  profit: boolean;
};
const StatCard: FC<StatCardProps> = ({ title, number, netValue, profit }) => {
  return (
    <div
      className="w-full h-[160px] flex flex-col space-y-4 bg-white p-[12px] rounded-[8px] border-l-4 border-secondary"
      style={{ boxShadow: "0px 2px 10px 0px #0A0D1226" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[14px] md:text-[16px] text-[#A4A7AE]">
          {title}
        </h3>
        <GoArrowUpRight size={20} color="#A4A7AE" />
      </div>

      <h2 className="font-semibold text-[32px] md:text-[36px] text-black leading-[44px]">
        {number}
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            {profit ? (
              <GoArrowUp size={20} color="#12B76A" />
            ) : (
              <GoArrowDown size={20} color="#F04438" />
            )}
            <h3
              className={`font-semibold text-[10px] md:text-[14px] ${
                profit ? "text-[#027A48]" : "text-[#B42318]"
              }`}
            >
              {netValue}%
            </h3>
          </div>
          <p className="text-[#727272] text-[8px] md:text-[12px] ">
            vs last month
          </p>
        </div>
        {profit ? (
          <Image
            src="/images/profit_chart.png"
            alt="profit chart"
            width={72}
            height={36}
          />
        ) : (
          <Image
            src="/images/loss_chart.png"
            alt="loss chart"
            width={72}
            height={36}
          />
        )}
      </div>
    </div>
  );
};

export default StatCard;

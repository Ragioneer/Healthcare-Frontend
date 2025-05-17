import React, { FC } from "react";
import "react-phone-number-input/style.css";
import RPhoneInput from "react-phone-number-input";

type PhoneInputProps = {
  phoneNo: string;
  setPhoneNo: React.Dispatch<React.SetStateAction<string>>;
  error: string;
};
const PhoneInput: FC<PhoneInputProps> = ({ phoneNo, setPhoneNo, error }) => {
  return (
    <RPhoneInput
      placeholder="Enter phone number"
      value={phoneNo}
      onChange={(val) => setPhoneNo(val ? val.toString() : "")}
      className={`mt-2 w-full border border-[#F5F7F9] placeholder:text-[#767676] text-[#767676] bg-white outline-none rounded-[8px] pl-[16px] pr-[36px] py-[12px] phone-number-field ${
        error ? "border-red-500" : ""
      }`}
    />
  );
};

export default PhoneInput;

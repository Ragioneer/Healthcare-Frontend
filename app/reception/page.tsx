"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-phone-number-input/style.css";
import RPhoneInput from "react-phone-number-input";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // ✅ not "@/lib/auth" or relative
import MainCard from "@/components/ui/MainCard";
import { Phone } from "lucide-react";

const user_id = getUserEmailFromToken(); // before calling apiPost
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ReceptionPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async () => {
    if (!name || !phone || !reason) {
      setConfirmation("❌ Please fill in all fields.");
      return;
    }

    const payload = {
      user_id: user_id, // Temporary static user
      name,
      phone,
      reason,
    };

    try {
      await axios.post(`${baseURL}/reception/request`, payload);
      setConfirmation("✅ Your request has been sent to a receptionist.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Failed to submit. Please check your inputs.");
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <MainCard
        headerText="Connect to Receptionist"
        headerIcon={<Phone size={20} />}
        buttonText="Submit Your Request"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-8 p-4">
          <div>
            <Label>Purpose of Request</Label>
            <Input
              placeholder="e.g. Urgent help"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter your name"
              value={reason}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <div className="w-full relative">
              <RPhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => setPhone(val ? val.toString() : "")}
                className="mt-1 w-full border border-[#F5F7F9] placeholder:text-[#767676] bg-white outline-none rounded-[8px] pl-[16px] pr-[36px] py-[12px]"
              />
            </div>
          </div>
        </div>
      </MainCard>
    </div>
  );
}

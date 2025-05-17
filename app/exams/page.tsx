"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // near top
import MainCard from "@/components/ui/MainCard";
import { Beaker } from "lucide-react";

const user_id = getUserEmailFromToken(); // before calling apiPost
const baseURL = process.env.NEXT_PUBLIC_API_URL;
export default function ExamPage() {
  const [specialization, setSpecialization] = useState("");
  const [examType, setExamType] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSchedule = async () => {
    if (!specialization || !examType || !scheduledTime || !purpose) {
      setConfirmation("❌ Please fill in all fields.");
      return;
    }

    const payload = {
      user_id: user_id, // Static for now
      specialization,
      exam_type: examType,
      scheduled_time: scheduledTime,
      purpose,
    };

    try {
      await axios.post(`${baseURL}/exam/schedule`, payload);
      setConfirmation("✅ Exam successfully scheduled.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Scheduling failed. Please check your inputs.");
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <MainCard
        headerText="Schedule an Exam"
        headerIcon={<Beaker size={20} />}
        buttonText="Confirm Booking"
        onSubmit={handleSchedule}
      >
        <div className="flex flex-col gap-y-8 p-4">
          <div>
            <Label>Specialization</Label>
            <Input
              placeholder="e.g. Neurology"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>

          <div>
            <Label>Exam Type</Label>
            <Input
              placeholder="e.g. MRI, blood test"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            />
          </div>

          <div>
            <Label>Date and Time</Label>
            <Input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          <div>
            <Label>Enter your purpose</Label>
            <Input
              placeholder="e.g. Routine exam"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </div>
      </MainCard>
    </div>
  );
}

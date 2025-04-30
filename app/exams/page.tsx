'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // near top

const user_id = getUserEmailFromToken(); // before calling apiPost

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
      await axios.post("http://localhost:8000/exam/schedule", payload);
      setConfirmation("✅ Exam successfully scheduled.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Scheduling failed. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">🧪 Schedule Medical Exam</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Specialization</Label>
            <Input
              placeholder="e.g. Neurology"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Exam Type</Label>
            <Input
              placeholder="e.g. MRI, blood test"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Purpose</Label>
            <Input
              placeholder="e.g. Routine exam"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>

          <Button
            onClick={handleSchedule}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Confirm Booking
          </Button>

          {confirmation && (
            <div className="text-center mt-4 text-blue-700 text-sm font-medium">
              {confirmation}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

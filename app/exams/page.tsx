'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function ExamPage() {
  const [specialization, setSpecialization] = useState("");
  const [examType, setExamType] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSchedule = async () => {
    const payload = {
      user_id: "user1", // static for now
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
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Schedule a Medical Exam</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Specialization</Label>
            <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Neurology" />
          </div>
          <div>
            <Label>Exam Type</Label>
            <Input value={examType} onChange={(e) => setExamType(e.target.value)} placeholder="e.g. MRI, blood test" />
          </div>
          <div>
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          </div>
          <div>
            <Label>Purpose</Label>
            <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Routine exam" />
          </div>
          <Button onClick={handleSchedule}>Confirm Booking</Button>
          {confirmation && <p className="mt-4 text-green-600">{confirmation}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { getUserEmailFromToken } from '@/lib/auth'; // ✅ not "@/lib/auth" or relative


const user_id = getUserEmailFromToken(); // before calling apiPost

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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reception/request`, payload);
      setConfirmation("✅ Your request has been sent to a receptionist.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Failed to submit. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">💬 Connect to a Human Receptionist</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Purpose of Request</Label>
            <Input
              placeholder="e.g. Urgent help"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Phone Number</Label>
            <Input
              placeholder="+92XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Your Name</Label>
            <Input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Submit Request
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

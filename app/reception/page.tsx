'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function ReceptionPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async () => {
    const payload = {
      user_id: "user1", // Temporary static user
      name,
      phone,
      reason,
    };

    try {
      await axios.post("http://localhost:8000/reception/request", payload);
      setConfirmation("✅ Your request has been sent to a receptionist.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Failed to submit. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Connect to a Human Receptionist</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Purpose of Request</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Urgent help" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92XXXXXXXXXX" />
          </div>
          <div>
            <Label>Your Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <Button onClick={handleSubmit}>Submit Request</Button>
          {confirmation && <p className="mt-4 text-green-600">{confirmation}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface BookingResponse {
  doctor_id: string;
  datetime: string;
}

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get<Doctor[]>("http://localhost:8000/doctors");
        setDoctors(res.data);
      } catch (error) {
        setConfirmation("❌ Failed to load doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !datetime || !purpose) {
      setConfirmation("❌ Please fill in all fields before booking.");
      return;
    }

    try {
      const payload = {
        user_id: "user-123", // TODO: Replace with dynamic user input later
        doctor_id: selectedDoctor,
        datetime: new Date(datetime).toISOString(),
        purpose,
      };

      const res = await axios.post<BookingResponse>(
        "http://localhost:8000/doctors/book",
        payload
      );

      setConfirmation(`✅ Appointment booked with ${res.data.doctor_id} at ${res.data.datetime}`);
    } catch (error) {
      console.error(error);
      setConfirmation("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-xl mx-auto p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Schedule an Appointment</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Doctor</Label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">-- Choose a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <div>
            <Label>Purpose</Label>
            <Input
              placeholder="e.g. Chest pain"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button onClick={handleBook} className="w-full">
            Confirm Booking
          </Button>

          {confirmation && (
            <p className="mt-4 text-sm text-center text-blue-700">{confirmation}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

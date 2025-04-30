"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // near top

const user_id = getUserEmailFromToken(); // before calling apiPost

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
        user_id: user_id,
        doctor_id: selectedDoctor,
        datetime: new Date(datetime).toISOString(),
        purpose,
      };

      const res = await axios.post<BookingResponse>(
        "http://localhost:8000/doctors/book",
        payload
      );

      setConfirmation(
        `✅ Appointment booked with Dr. ${selectedDoctor} at ${new Date(res.data.datetime).toLocaleString()}`
      );
    } catch (error) {
      console.error(error);
      setConfirmation("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">📅 Schedule Appointment</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Select Doctor</Label>
            <select
              className="w-full mt-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <Label className="text-sm font-semibold">Date & Time</Label>
            <Input
              type="datetime-local"
              className="rounded-lg mt-1"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">Purpose</Label>
            <Input
              className="rounded-lg mt-1"
              placeholder="e.g. Chest pain, follow-up visit..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button
            onClick={handleBook}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Confirm Booking
          </Button>

          {confirmation && (
            <div className="text-center text-sm mt-4 text-blue-700">
              {confirmation}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

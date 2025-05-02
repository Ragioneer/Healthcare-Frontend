// app/appointments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth";

const user_id = getUserEmailFromToken();

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  const [patientName, setPatientName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

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
    if (!selectedDoctor || !datetime || !purpose || !patientName || !email || !phone || !gender || !birthdate || !appointmentType) {
      setConfirmation("❌ Please fill in all fields before booking.");
      return;
    }

    try {
      const payload = {
        user_id,
        doctor_id: selectedDoctor,
        datetime: new Date(datetime).toISOString(),
        purpose,
        patient_name: patientName,
        email,
        phone,
        gender,
        birthdate,
        appointment_type: appointmentType,
        notes
      };

      const res = await axios.post("http://localhost:8000/doctors/book", payload);

      setConfirmation("✅ Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      setConfirmation("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-4xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">📅 Schedule Appointment</h2>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-full">
              <Label className="text-base font-semibold text-gray-700">Doctor Information</Label>
            </div>
            <div className="sm:col-span-2">
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

            <InputField label="Date & Time" type="datetime-local" value={datetime} onChange={setDatetime} />
            <InputField label="Purpose" value={purpose} onChange={setPurpose} placeholder="e.g. Chest pain" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="col-span-full">
              <Label className="text-base font-semibold text-gray-700">Patient Information</Label>
            </div>
            <InputField label="Patient Name" value={patientName} onChange={setPatientName} />
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <InputField label="Phone" value={phone} onChange={setPhone} />

            <div>
              <Label className="text-sm font-semibold">Gender</Label>
              <select
                className="w-full mt-1 p-2 rounded-lg border border-gray-300"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <InputField label="Birthdate" type="date" value={birthdate} onChange={setBirthdate} />

            <div>
              <Label className="text-sm font-semibold">Appointment Type</Label>
              <select
                className="w-full mt-1 p-2 rounded-lg border border-gray-300"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <option value="">-- Select Type --</option>
                <option value="in-person">In-person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            <InputField label="Notes (optional)" value={notes} onChange={setNotes} />
          </div>

          <Button
            onClick={handleBook}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
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

function InputField({ label, value, onChange, placeholder = "", type = "text" }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold">{label}</Label>
      <Input
        type={type}
        className="w-full rounded-lg mt-1 border border-gray-300"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

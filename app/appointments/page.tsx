"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth";
import MainCard from "@/components/ui/MainCard";
import { Calendar } from "lucide-react";
import DoctorCard from "@/components/appointments/DoctorCard";
import AppointmentConfirmationModal from "@/components/appointments/AppointmentConfirmationModal";
import { useClient } from "@/context/ClientContext";

const user_id = getUserEmailFromToken();
const baseURL = process.env.NEXT_PUBLIC_API_URL;
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image?: string;
}

const dummyData: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Doe",
    specialization: "Neurology",
  },
  {
    id: "2",
    name: "Dr. Jane Doe",
    specialization: "Cardiology",
  },
  {
    id: "3",
    name: "Dr. John Doe",
    specialization: "Neurology",
  },
  {
    id: "4",
    name: "Dr. Jane Doe",
    specialization: "Cardiology",
  },
  {
    id: "5",
    name: "Dr. John Doe",
    specialization: "Neurology",
  },
  {
    id: "6",
    name: "Dr. Jane Doe",
    specialization: "Cardiology",
  },
  {
    id: "7",
    name: "Dr. John Doe",
    specialization: "Neurology",
  },
  {
    id: "8",
    name: "Dr. Jane Doe",
    specialization: "Cardiology",
  },
];

export default function AppointmentsPage() {
  const client = useClient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentlySelectedDoctor, setCurrentlySelectedDoctor] =
    useState<Doctor | null>(null);

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
        const res = await axios.get<Doctor[]>(`${baseURL}/doctors`);
        setDoctors(res.data);
      } catch (error) {
        setConfirmation("❌ Failed to load doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    console.log("doctor", doctor);
    console.log("start");
    setCurrentlySelectedDoctor(doctor);
    setModalOpen(true);
    console.log("end");
  };
  const handleBook = async () => {
    if (
      !selectedDoctor ||
      !datetime ||
      !purpose ||
      !patientName ||
      !email ||
      !phone ||
      !gender ||
      !birthdate ||
      !appointmentType
    ) {
      setConfirmation("❌ Please fill in all fields before booking.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setConfirmation("❌ Invalid email format.");
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
        birthdate: new Date(birthdate).toISOString(),
        appointment_type: appointmentType,
        notes: notes || "N/A",
      };

      await axios.post(`${baseURL}/doctors/book`, payload);
      setConfirmation("✅ Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      setConfirmation("❌ Booking failed. Please try again.");
    }
  };

  const handleShowMore = () => {};

  return (
    <div className="h-full flex justify-center items-center px-4">
      <MainCard
        headerText="Schedule Your Appointment"
        headerIcon={<Calendar size={20} />}
        buttonText="View More Doctors"
        onSubmit={handleShowMore}
        buttonVariant={client === "nudii" ? "outline" : "default"}
      >
        <div className="h-full flex flex-col overflow-y-auto custom-visible-scrollbar gap-y-8 p-4">
          {dummyData.map((doctor) => (
            <div key={doctor.id} onClick={() => handleSelectDoctor(doctor)}>
              <DoctorCard
                key={doctor.id}
                name={doctor.name}
                specialization={doctor.specialization}
              />
            </div>
          ))}
        </div>
      </MainCard>
      <AppointmentConfirmationModal
        isOpen={isModalOpen}
        doctor={currentlySelectedDoctor}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

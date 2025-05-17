"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // near top
import { Pencil } from "lucide-react";
import MainCard from "@/components/ui/MainCard";

const user_id = getUserEmailFromToken(); // before calling apiPost
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function QuotationPage() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [details, setDetails] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async () => {
    if (!category || !subcategory || !details) {
      setConfirmation("❌ Please fill in all fields.");
      return;
    }

    const payload = {
      user_id: user_id, // static for now
      category,
      subcategory,
      details,
    };

    try {
      await axios.post(`${baseURL}/quote/request`, payload);
      setConfirmation("✅ Quotation request submitted successfully.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <MainCard
        headerText="Request a Quotation"
        headerIcon={<Pencil size={20} />}
        buttonText="Confirm Request"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-8 p-4">
          <div>
            <Label>Subject Category</Label>
            <Input
              placeholder="e.g. Surgery"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <Label>Sub Category</Label>
            <Input
              placeholder="e.g. Bariatric"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          <div>
            <Label>Enter your Details</Label>
            <Input
              placeholder="Describe the case..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
      </MainCard>
    </div>
  );
}

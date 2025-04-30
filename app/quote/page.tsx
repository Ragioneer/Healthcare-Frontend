'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { getUserEmailFromToken } from "@/lib/auth"; // near top

const user_id = getUserEmailFromToken(); // before calling apiPost

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
      await axios.post("http://localhost:8000/quote/request", payload);
      setConfirmation("✅ Quotation request submitted successfully.");
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">📄 Request a Quotation</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Subject Category</Label>
            <Input
              placeholder="e.g. Surgery"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Subcategory</Label>
            <Input
              placeholder="e.g. Bariatric"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Details</Label>
            <Input
              placeholder="Describe the case..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
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

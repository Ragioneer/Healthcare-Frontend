'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function QuotationPage() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [details, setDetails] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async () => {
    const payload = {
      user_id: "user1", // static for now
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
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Request a Quotation</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Subject Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Surgery" />
          </div>
          <div>
            <Label>Subcategory</Label>
            <Input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. Bariatric" />
          </div>
          <div>
            <Label>Details</Label>
            <Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the case..." />
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
          {confirmation && <p className="mt-4 text-green-600">{confirmation}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

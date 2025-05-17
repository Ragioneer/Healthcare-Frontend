"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainCard from "@/components/ui/MainCard";
import { TextArea } from "@/components/ui/textarea";
import { useClient } from "@/context/ClientContext";
import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const ClinicalResearch = () => {
  const client = useClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("undiagnosed");
  const [medications, setMedications] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitResearch = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("full_name", name);
      formData.append("medications", medications);
      formData.append("test_results_description", description);
      formData.append("diagnosis", diagnosis);
      formData.append("test_result_file", file ?? "");
      formData.append("lead_source", "nudii.com.br");

      const res = await axios.post(`${baseURL}/chat/clinical-trial`, formData);
      setName("");
      setMedications("");
      setDescription("");
      setDiagnosis("");
      setFile(null);
      toast.success("Clinical trial form submitted successfully");
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to submit Clinical trial form");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-full flex justify-center items-center px-4">
      <MainCard
        headerText="Have IBD? Apply for clinical research"
        buttonText="Submit Application"
        onSubmit={handleSubmitResearch}
        isLoading={isLoading}
        buttonVariant={client === "nudii" ? "outline" : "default"}
      >
        <div className="flex flex-col gap-y-6 px-4 py-8">
          <div>
            <Label className="text-[#242424]">Full Name</Label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-[#242424]">Medications already used</Label>
            <TextArea
              placeholder="E.g Urgent help"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-[#242424]">
              Upload or describe recent test results (optional)
            </Label>
            <div className="w-full relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <span
                onClick={handleUploadClick}
                className="flex items-center gap-x-2 absolute top-2 bg-secondary text-[16px] md:text-[20px] text-[#242424] rounded-tl-[8px] rounded-bl-[8px] px-8 py-[14.5px] cursor-pointer"
              >
                <FiPlus size={20} />
                <p className="hidden md:block text-[14px]">Upload</p>
              </span>
              <Input
                placeholder="Describe here..."
                className="pl-[140px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between text-[#242424] px-4 py-2 border border-input rounded-md bg-gray-50">
              <span className="truncate text-sm">{fileName}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={18} />
              </button>
            </div>
          )}

          <div>
            <Label className={"text-[#242424]"}>Diagnosis?</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[
                {
                  label: "Crohn's Disease",
                  value: "crohn",
                  id: "crohn-disease",
                },
                {
                  label: "Ulcerative Colitis",
                  value: "ulcerative",
                  id: "ulcerative-colitis",
                },
                {
                  label: "Not diagnosed yet",
                  value: "undiagnosed",
                  id: "not-diagnosed-yet",
                },
              ].map(({ label, value, id }) => (
                <div className="flex items-center gap-2" key={id}>
                  <input
                    id={id}
                    type="radio"
                    value={value}
                    name="diagnosis"
                    className="w-4 h-4 accent-primary cursor-pointer"
                    checked={diagnosis === value}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                  <label
                    htmlFor={id}
                    className={`text-[10px] cursor-pointer text-[#242424] md:text-[14px]`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainCard>
    </div>
  );
};

export default ClinicalResearch;

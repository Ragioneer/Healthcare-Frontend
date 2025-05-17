"use client";
import { Input } from "@/components/ui/input";
import MainCard from "@/components/ui/MainCard";
import { useClient } from "@/context/ClientContext";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { LuSettings } from "react-icons/lu";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const MODEL_OPTIONS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
];

const LLMSettings = () => {
  const client = useClient();
  const token = Cookies.get("token");

  const [model, setModel] = useState<string>("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(1);
  const [maxToken, setMaxToken] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${baseURL}/admin/llm`,
        {
          prompt: systemPrompt,
          temperature: temperature,
          max_tokens: maxToken,
          model: model,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("LLM Settings Updated!");
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to fetch URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLLM = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/admin/llm`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModel(response.data.data.llm_settings.model);
      setSystemPrompt(response.data.data.llm_settings.prompt);
      setTemperature(response.data.data.llm_settings.temperature);
      setMaxToken(response.data.data.llm_settings.max_tokens);
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to fetch URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLLM();
  }, []);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <MainCard
        headerText="LLM Settings"
        headerIcon={<LuSettings size={20} />}
        buttonText="Update Settings"
        onSubmit={handleSubmit}
        buttonVariant={client === "nudii" ? "outline" : "default"}
        isLoading={isLoading}
      >
        <div className="w-full mb-4">
          <Label className="text-[#242424]">Model</Label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="flex h-10 w-full rounded-md text-primary border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {MODEL_OPTIONS.map((option) => (
              <option
                className="text-primary text-[16px] font-medium"
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full mb-4">
          <Label className="text-[#242424]">System Prompt</Label>
          <Input
            type="text"
            placeholder="Enter your prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>

        <div className="w-full mb-4">
          <Label className="text-[#242424]">Temperature</Label>
          <Input
            type="number"
            placeholder="Enter Temperature"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </div>

        <div className="w-full mb-4">
          <Label className="text-[#242424]">Max Token</Label>
          <Input
            type="number"
            placeholder="Enter Token"
            value={maxToken}
            onChange={(e) => setMaxToken(Number(e.target.value))}
          />
        </div>
      </MainCard>
    </div>
  );
};

export default LLMSettings;

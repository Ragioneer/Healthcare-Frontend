// app/admin/page.tsx
'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function AdminPanelPage() {
  const [tab, setTab] = useState("upload");
  const [userId, setUserId] = useState("user-123");
  const [files, setFiles] = useState<FileList | null>(null);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [resultData, setResultData] = useState<any>(null);

  const [llmSettings, setLLMSettings] = useState({
    prompt: "",
    temperature: 0.7,
    max_tokens: 400,
    model: "gpt-4"
  });

  const uploadDocs = async () => {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("user_id", userId);

    try {
      await axios.post("http://localhost:8000/ingest/upload", formData);
      setStatus("✅ Upload successful");
    } catch {
      setStatus("❌ Upload failed");
    }
  };

  const ingestURL = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("url", url);
      formData.append("user_id", userId);

      await axios.post("http://localhost:8000/ingest/url", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setStatus("✅ URL content ingested");
    } catch {
      setStatus("❌ URL ingestion failed");
    }
  };

  const updateLLM = async () => {
    try {
      await axios.put("http://localhost:8000/admin/llm", llmSettings);
      setStatus("✅ LLM settings updated");
    } catch {
      setStatus("❌ Failed to update LLM settings");
    }
  };

  const fetchData = async (type: string) => {
    try {
      const endpointMap: Record<string, string> = {
        files: `http://localhost:8000/ingest/file-logs?user_id=${userId}`,
        urls: `http://localhost:8000/ingest/url-logs?user_id=${userId}`,
        chats: "http://localhost:8000/chat/history",
        appointments: `http://localhost:8000/doctors/appointments?user_id=${userId}`,
        reception: `http://localhost:8000/reception/request?user_id=${userId}`,
        exams: `http://localhost:8000/exam/schedule?user_id=${userId}`,
        quotations: `http://localhost:8000/quote/request?user_id=${userId}`
      };

      const res = await axios.get(endpointMap[type]);
      setResultData(res.data);
      setStatus(`✅ ${type} data fetched`);
    } catch {
      setStatus(`❌ Failed to fetch ${type} data`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-3xl mx-auto p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Admin Control Panel</h2>

        <div className="mb-6">
          {/* <Label>User ID</Label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user_id (e.g. user-123)"
          /> */}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {["upload", "url", "llm", "data"].map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t)}
            >
              {t === "upload"
                ? "Upload File"
                : t === "url"
                ? "Ingest URL"
                : t === "llm"
                ? "LLM Settings"
                : "Data Viewer"}
            </Button>
          ))}
        </div>

        <CardContent className="space-y-4">
          {tab === "upload" && (
            <>
              <Label>Upload Medical Docs</Label>
              <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
              <Button onClick={uploadDocs}>Upload</Button>
            </>
          )}

          {tab === "url" && (
            <>
              <Label>Paste URL to Ingest</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
              <Button onClick={ingestURL}>Ingest</Button>
            </>
          )}

          {tab === "llm" && (
            <>
              <Label>Model</Label>
              <Input value={llmSettings.model} onChange={(e) => setLLMSettings({ ...llmSettings, model: e.target.value })} />

              <Label>Prompt</Label>
              <Input value={llmSettings.prompt} onChange={(e) => setLLMSettings({ ...llmSettings, prompt: e.target.value })} />

              <Label>Temperature</Label>
              <Input
                type="number"
                step="0.1"
                value={llmSettings.temperature}
                onChange={(e) => setLLMSettings({ ...llmSettings, temperature: parseFloat(e.target.value) })}
              />

              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={llmSettings.max_tokens}
                onChange={(e) => setLLMSettings({ ...llmSettings, max_tokens: parseInt(e.target.value) })}
              />

              <Button onClick={updateLLM}>Update LLM</Button>
            </>
          )}

          {tab === "data" && (
            <>
            <div className="space-y-4">
            <Label>User ID</Label>
            <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user_id (e.g. user-123)"
        />
        </div>
              <h3 className="font-semibold">Ingested Data</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => fetchData("files")}>Files</Button>
                <Button onClick={() => fetchData("urls")}>URLs</Button>
                <Button onClick={() => fetchData("chats")}>Chats</Button>
              </div>

              <h3 className="font-semibold mt-6">User Requests</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => fetchData("appointments")}>Appointments</Button>
                <Button onClick={() => fetchData("reception")}>Reception</Button>
                <Button onClick={() => fetchData("exams")}>Exams</Button>
                <Button onClick={() => fetchData("quotations")}>Quotations</Button>
              </div>

              {resultData && (
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm mt-4">
                  {JSON.stringify(resultData, null, 2)}
                </pre>
              )}
            </>
          )}

          {status && <p className="text-blue-600 mt-4">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

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
    model: "gpt-4o"
  });

  const uploadDocs = async () => {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("user_id", userId);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingest/upload`, formData);
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

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingest/url`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setStatus("✅ URL content ingested");
    } catch {
      setStatus("❌ URL ingestion failed");
    }
  };

  const updateLLM = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/llm`, llmSettings);
      setStatus("✅ LLM settings updated");
    } catch {
      setStatus("❌ Failed to update LLM settings");
    }
  };

  const fetchData = async (type: string) => {
    const endpointMap: Record<string, string> = {
      files: `${process.env.NEXT_PUBLIC_API_URL}/ingest/file-logs?user_id=${userId}`,
      urls: `${process.env.NEXT_PUBLIC_API_URL}/ingest/url-logs?user_id=${userId}`,
      chats: `${process.env.NEXT_PUBLIC_API_URL}/chat/history`,
      appointments: `${process.env.NEXT_PUBLIC_API_URL}/doctors/appointments?user_id=${userId}`,
      reception: `${process.env.NEXT_PUBLIC_API_URL}/reception/request?user_id=${userId}`,
      exams: `${process.env.NEXT_PUBLIC_API_URL}/exam/schedule?user_id=${userId}`,
      quotations: `${process.env.NEXT_PUBLIC_API_URL}/quote/request?user_id=${userId}`
    };

    try {
      const res = await axios.get(endpointMap[type]);
      setResultData(res.data);
      setStatus(`✅ ${type} data fetched`);
    } catch {
      setStatus(`❌ Failed to fetch ${type} data`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 flex justify-center items-start">
      <Card className="w-full max-w-4xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">🛠 Admin Control Panel</h2>

        <div className="flex justify-center gap-3 flex-wrap mb-8">
          {["upload", "url", "llm", "data"].map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setTab(t)}
            >
              {{
                upload: "📤 Upload File",
                url: "🌐 Ingest URL",
                llm: "🧠 LLM Settings",
                data: "📊 Data Viewer",
              }[t]}
            </Button>
          ))}
        </div>

        <CardContent className="space-y-6">
          {tab === "upload" && (
            <>
              <Label className="font-semibold">Upload Medical Files</Label>
              <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
              <Button className="mt-2 w-full" onClick={uploadDocs}>Upload</Button>
            </>
          )}

          {tab === "url" && (
            <>
              <Label className="font-semibold">Ingest from URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
              />
              <Button className="mt-2 w-full" onClick={ingestURL}>Ingest</Button>
            </>
          )}

          {tab === "llm" && (
            <>
              <Label className="font-semibold">Model</Label>
              <Input value={llmSettings.model} onChange={(e) => setLLMSettings({ ...llmSettings, model: e.target.value })} />

              <Label className="font-semibold">System Prompt</Label>
              <Input value={llmSettings.prompt} onChange={(e) => setLLMSettings({ ...llmSettings, prompt: e.target.value })} />

              <Label className="font-semibold">Temperature</Label>
              <Input
                type="number"
                step="0.1"
                value={llmSettings.temperature}
                onChange={(e) => setLLMSettings({ ...llmSettings, temperature: parseFloat(e.target.value) })}
              />

              <Label className="font-semibold">Max Tokens</Label>
              <Input
                type="number"
                value={llmSettings.max_tokens}
                onChange={(e) => setLLMSettings({ ...llmSettings, max_tokens: parseInt(e.target.value) })}
              />

              <Button className="mt-2 w-full" onClick={updateLLM}>Update Settings</Button>
            </>
          )}

          {tab === "data" && (
            <>
              <div>
                <Label className="font-semibold">User ID</Label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. user-123"
                />
              </div>

              <h3 className="text-lg font-semibold mt-4">Ingested Data</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button onClick={() => fetchData("files")}>📁 Files</Button>
                <Button onClick={() => fetchData("urls")}>🔗 URLs</Button>
                <Button onClick={() => fetchData("chats")}>💬 Chats</Button>
              </div>

              <h3 className="text-lg font-semibold mt-6">User Requests</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => fetchData("appointments")}>📅 Appointments</Button>
                <Button onClick={() => fetchData("reception")}>🧑‍💼 Reception</Button>
                <Button onClick={() => fetchData("exams")}>🧪 Exams</Button>
                <Button onClick={() => fetchData("quotations")}>📄 Quotations</Button>
              </div>

              {resultData && (
                <pre className="bg-gray-100 p-4 rounded mt-4 max-h-[400px] overflow-auto text-sm whitespace-pre-wrap">
                  {JSON.stringify(resultData, null, 2)}
                </pre>
              )}
            </>
          )}

          {status && <div className="text-center text-blue-600 font-medium">{status}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

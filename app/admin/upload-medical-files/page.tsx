"use client";
import MainCard from "@/components/ui/MainCard";
import axios from "axios";
import React, { useState, useCallback } from "react";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaCheck } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

interface FileWithId {
  id: string;
  file: File;
  uploaded: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const UploadMedicalFiles = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const token = Cookies.get("token");

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const newProgress: { [key: string]: number } = {};

    selectedFiles.forEach((file) => {
      newProgress[file.id] = 0;
    });
    setUploadProgress(newProgress);

    for (const fileWithId of selectedFiles) {
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newValue = prev[fileWithId.id] + 10;
            if (newValue >= 100) {
              clearInterval(interval);
              resolve();
              return { ...prev, [fileWithId.id]: 100 };
            }
            return { ...prev, [fileWithId.id]: newValue };
          });
        }, 50);
      });
    }

    // Update files to uploaded status
    setSelectedFiles((prev) =>
      prev.map((file) => ({
        ...file,
        uploaded: true,
      }))
    );

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`files`, selectedFiles[i].file);
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${baseURL}/ingest/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setDocumentIds(
        res.data.data.results.map(
          (result: {
            document_id: string;
            filename: string;
            text_snippet: string;
          }) => result.document_id
        )
      );
      toast.success("Files uploaded successfully.");
    } catch (error) {
      console.log("error:", error);
      toast.error("Error! Failed to upload files. Please try again.");
    } finally {
      setIsLoading(false);
    }
    setIsUploading(false);
  };

  function downloadPdfFromRawString(
    rawPdfString: string,
    filename = "file.pdf"
  ) {
    const byteArray = new TextEncoder().encode(rawPdfString);

    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleDownload = async (documentId: string) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseURL}/ingest/file/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res:", res);
      downloadPdfFromRawString(res.data);
      toast.success("File downloaded successfully.");
    } catch (error) {
      console.log("error:", error);
      toast.error("Error! Failed to download file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        uploaded: false,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        uploaded: false,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  console.log("documentIds", documentIds);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <MainCard
        headerText="Upload your medical files"
        headerIcon={<LuCloudUpload size={20} />}
        buttonText={isUploading || isLoading ? "Uploading..." : "Upload"}
        onSubmit={handleSubmit}
        buttonVariant={"outline"}
        isLoading={isLoading}
      >
        <div
          className={`bg-white rounded-[8px] flex flex-col gap-y-4 p-4 mb-4 items-center justify-center cursor-pointer transition-all
            ${
              isDragging
                ? "border-2 border-primary bg-blue-50"
                : "border-2 border-transparent"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
          />

          <span
            className={`border-4 rounded-full p-2 ${
              isDragging
                ? "border-primary text-primary"
                : "border-[#DEE7EC] text-white bg-primary"
            }`}
          >
            <LuCloudUpload size={20} />
          </span>

          {selectedFiles.length === 0 ? (
            <p className="text-primary font-[600] text-[12px] md:text-[14px]">
              Click to upload{" "}
              <span className="font-normal text-[#767676]">
                or drag and drop
              </span>
            </p>
          ) : (
            <div className="w-full space-y-4">
              {selectedFiles.map((fileWithId, index) => (
                <div key={fileWithId.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">
                        {fileWithId.file.name}
                        <span className="text-xs text-gray-500 ml-2">
                          ({(fileWithId.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </span>
                      {fileWithId.uploaded && (
                        <span className="text-green-500 text-sm">
                          <FaCheck size={20} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(isUploading || isLoading) &&
                        documentIds.length > 0 &&
                        documentIds[index]?.length > 0 && (
                          <span
                            className="text-primary hover:text-secondary border border-black cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(documentIds[index]);
                            }}
                          >
                            <FiDownload size={20} />
                          </span>
                        )}
                      {!isUploading && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(fileWithId.id);
                          }}
                        >
                          <LuX size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                  {uploadProgress[fileWithId.id] > 0 &&
                    !fileWithId.uploaded && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress[fileWithId.id]}%` }}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </MainCard>
    </div>
  );
};

export default UploadMedicalFiles;

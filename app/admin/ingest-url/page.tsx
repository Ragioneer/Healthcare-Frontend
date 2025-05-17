"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainCard from "@/components/ui/MainCard";
import { useClient } from "@/context/ClientContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { LuLink, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loader from "@/components/ui/Loader";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const IngestUrl = () => {
  const client = useClient();
  const token = Cookies.get("token");

  const [link, setLink] = useState<string>("");
  const [links, setLinks] = useState<
    {
      id: string;
      url: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletedUrlId, setDeleteUrlId] = useState<string>("");

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${baseURL}/url/`,
        {
          url: link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLinks((prev) => [
        ...prev,
        { id: res.data.data.document_id, url: res.data.data.url },
      ]);
      toast.success("URL uploaded successfully.");
      setLink("");
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to upload URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchURL = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/url/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLinks(
        response.data.data.documents.map(
          (doc: { _id: string; source: string }) => ({
            id: doc._id,
            url: doc.source,
          })
        )
      );
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to fetch URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/url/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLinks(links.filter((link) => link.id !== id));
      toast.success("URL deleted successfully.");
    } catch (error) {
      console.log("error", error);
      toast.error("Error! Failed to delete URL. Please try again.");
    } finally {
      setDeleteUrlId("");
    }
  };

  useEffect(() => {
    fetchURL();
  }, []);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <MainCard
        headerText="Ingest From Url"
        headerIcon={<LuLink size={20} />}
        buttonText="Upload"
        onSubmit={handleSubmit}
        buttonVariant={client === "nudii" ? "outline" : "default"}
        isLoading={isLoading}
      >
        <div className="w-full mb-4">
          <Label className="text-[#242424]">URL</Label>
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="www.example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <span className="absolute right-2 cursor-pointer text-[#767676] top-4">
              <LuLink size={20} />
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-y-4 mb-4 items-center justify-center">
          {links.map((link) => (
            <div className="w-full bg-white rounded-lg p-4 flex items-center justify-between">
              <span className="text-[14px] md:text-[16px] font-semibold text-primary">
                {link.url}
              </span>
              {deletedUrlId === link.id ? (
                <Loader />
              ) : (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteUrlId(link.id);
                    handleDelete(link.id);
                  }}
                >
                  <LuX size={24} />
                </button>
              )}
            </div>
          ))}
        </div>
      </MainCard>
    </div>
  );
};

export default IngestUrl;

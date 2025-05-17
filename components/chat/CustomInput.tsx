import { FC, useEffect, useState } from "react";
import {
  FaFile,
  FaFileAlt,
  FaFileCode,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaTimes,
} from "react-icons/fa";
import UploadButton from "./UploadButton";
import Loader from "../ui/Loader";
import { IoArrowUp, IoMicOutline } from "react-icons/io5";

type CustomInputProps = {
  handleSubmit: (input: string) => void;
  loader: boolean;
  selectedSuggestion?: string;
};

const CustomInput: FC<CustomInputProps> = ({
  handleSubmit,
  loader,
  selectedSuggestion,
}) => {
  const [input, setInput] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const removeFile = () => {
    setUploadedFile(null);
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleImageUpload = (images: FileList) => {
    const imageArray = Array.from(images);
    setUploadedImages(imageArray);
  };

  const getFileIcon = (filename: string) => {
    if (filename) {
      const ext = filename.split(".")?.pop()?.toLowerCase();

      switch (ext) {
        case "pdf":
          return <FaFilePdf className="text-red-500" size={20} />;
        case "docx":
          return <FaFileWord className="text-blue-500" size={20} />;
        case "txt":
          return <FaFileAlt className="text-gray-500" size={20} />;
        case "csv":
          return <FaFileCsv className="text-green-500" size={20} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel className="text-green-600" size={20} />;
        case "json":
          return <FaFileCode className="text-yellow-600" size={20} />;
        default:
          return <FaFile className="text-gray-400" size={20} />;
      }
    }
  };

  useEffect(() => {
    if (selectedSuggestion) {
      setInput(selectedSuggestion);
    }
  }, [selectedSuggestion]);
  return (
    <div
      className="flex flex-col items-center w-full relative rounded-[24px]"
      style={{ boxShadow: "4px 4px 16.9px 0px #00000000" }}
    >
      <div className="flex flex-col items-center w-full mb-2 relative px-2 bg-white border border-primary rounded-[24px]">
        <div className="w-full flex items-center overflow-x-auto py-1">
          {uploadedFile && (
            <div className="flex items-center gap-2 py-1 px-2 h-[70px] relative bg-gray-100 rounded-lg mr-2">
              {getFileIcon(uploadedFile.name)}
              <div>
                <h2 className="text-[12px] md:text-[14px] truncate max-w-[150px]">
                  {uploadedFile.name}
                </h2>
                <p className="text-[10px] md:text-[12px] text-gray-400">
                  {uploadedFile?.name?.split(".")?.pop()?.toUpperCase()}
                </p>
              </div>
              <button
                onClick={removeFile}
                className="ml-auto absolute top-0 -right-2 bg-gray-200 p-1 rounded-full text-primary600"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
          {uploadedImages.length > 0 && (
            <div className="flex w-full items-center gap-2">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1 h-[70px] bg-gray-100 relative rounded-lg"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`uploaded-image-${index}`}
                    className="w-[70px] h-full object-cover rounded"
                  />
                  <button
                    className="absolute top-0 -right-1 bg-gray-200 p-1 rounded-full text-primary600"
                    onClick={() => removeImage(index)}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <textarea
          placeholder={"Enter a prompt for mef IA."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await handleSubmit(input);
              setInput("");
            }
          }}
          className="outline-none w-full h-max-[250px] min-h-[100px] custom-scrollbar px-2 pt-8 pb-2 resize-none overflow-auto rounded-2xl text-[14px] md:text-[16px] mr-2 disabled:bg-white disabled:cursor-not-allowed"
        />

        <div className="w-full flex items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-2">
            <UploadButton
              onFileUpload={handleFileUpload}
              onImageUpload={handleImageUpload}
              isFileAdded={uploadedFile === null ? false : true}
              imageCount={uploadedImages.length}
              isLoader={loader}
            />
          </div>

          {loader ? (
            <Loader />
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer flex items-center justify-center bg-[#DEE7EC] text-primary hover:bg-primary hover:text-[#DEE7EC] rounded-full h-[32px] w-[32px] disabled:bg-[#C9CBCF]"
                type="button"
                disabled={loader}
              >
                <IoMicOutline size={20} />
              </button>
              <button
                className="cursor-pointer flex items-center justify-center bg-primary text-[#DEE7EC] hover:bg-[#DEE7EC] hover:text-primary rounded-full h-[32px] w-[32px] disabled:bg-[#C9CBCF]"
                type="button"
                onClick={async () => {
                  await handleSubmit(input);
                  setInput("");
                }}
                disabled={input.length === 0 || loader}
              >
                <IoArrowUp size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomInput;

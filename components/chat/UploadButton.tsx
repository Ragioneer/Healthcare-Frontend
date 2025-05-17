import { FC, useRef } from "react";
import { IoMdAdd } from "react-icons/io";

type uploadButtonPropsType = {
  onFileUpload: (file: File) => void;
  onImageUpload: (images: FileList) => void;
  isLoader: boolean;
  isFileAdded: boolean;
  imageCount: number;
};
const UploadButton: FC<uploadButtonPropsType> = ({
  onFileUpload,
  onImageUpload,
  isLoader,
  isFileAdded,
  imageCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (images) {
      onImageUpload(images);
    }
  };

  return (
    <>
      <button
        onClick={(e) => e.stopPropagation()}
        disabled={isLoader}
        className="rounded-full p-2 text-primary bg-[#DEE7EC] cursor-pointer hover:bg-primary hover:text-[#DEE7EC] duration-200 transition-all disabled:bg-[#C9CBCF] disabled:border-[#C9CBCF] disabled:cursor-not-allowed"
      >
        <IoMdAdd size={20} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.docx,.txt,.csv,.xls,.xlsx,.json"
        onChange={handleFileUpload}
      />

      <input
        type="file"
        ref={imageInputRef}
        style={{ display: "none" }}
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default UploadButton;

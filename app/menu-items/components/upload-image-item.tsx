"use client";

import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { RotateCcw, Trash2, Edit } from "lucide-react";
import { CustomFile } from "../hooks/useUploadImages";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useGetS3SignedUrl } from "../hooks";

type Props = {
  file: CustomFile;
  cancelUpload: (id: string) => void;
  retry: (id: string) => void;
  replace: (id: string, file: File) => void;
};

const UploadImageItem = ({ file, cancelUpload, retry, replace }: Props) => {
  const hiddenInput = useRef<HTMLInputElement | null>(null);

  const { mutate: fetchSignedUrl } = useGetS3SignedUrl();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // ---------------------------------------------------
  // ⭐ AUTO-FETCH SIGNED URL IF IMAGE IS FROM S3
  // ---------------------------------------------------
  useEffect(() => {
    // No need to fetch signed URL for new local files
    if (file.file) return;

    // If signed URL already computed → use it
    if (signedUrl) return;

    // If no key, cannot fetch S3 URL
    if (!file.key) return;

    fetchSignedUrl(
      { key: file.key },
      {
        onSuccess: (res) => {
          setSignedUrl(res.url); // API returns { url: signedUrl }
        },
        onError: () => {
          console.error("Failed to fetch signed S3 URL");
        },
      }
    );
  }, [file, fetchSignedUrl, signedUrl]);

  // ---------------------------------------------------
  // ⭐ Determine correct preview URL in priority order
  // ---------------------------------------------------
  const previewUrl = signedUrl
    ? signedUrl // 1️⃣ Signed URL from S3
    : file.url
    ? file.url // 2️⃣ Public backend URL
    : file.file
    ? URL.createObjectURL(file.file) // 3️⃣ Local temporary preview
    : "/placeholder.png"; // 4️⃣ Default placeholder

  // ---------------------------------------------------
  // Open replace picker
  // ---------------------------------------------------
  const openReplaceFilePicker = () => hiddenInput.current?.click();

  return (
    <div className="relative w-40 h-40 rounded-md overflow-hidden border shadow-sm group">
      {/* Preview Image */}
      <Image
        src={previewUrl}
        alt="preview"
        width={200}
        height={200}
        className="object-cover w-full h-full"
      />

      {/* Status Badge */}
      <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-xs font-semibold bg-black/40 text-white backdrop-blur">
        {file.state === "generating-url" && "Generating…"}
        {file.state === "uploading" && "Uploading…"}
        {file.state === "attaching" && "Saving…"}
        {file.state === "completed" && "Completed"}
        {file.state === "error" && "Failed"}
      </div>

      {/* Loading overlay */}
      {["generating-url", "uploading", "attaching"].includes(file.state) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Spinner className="text-white" />
        </div>
      )}

      {/* Error overlay */}
      {file.state === "error" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white space-y-2 cursor-pointer"
          onClick={() => retry(file.id)}
        >
          <RotateCcw className="h-6 w-6" />
          <p className="text-sm">Retry</p>
        </div>
      )}

      {/* Replace image */}
      {file.state === "completed" && (
        <>
          <button
            onClick={openReplaceFilePicker}
            className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow hover:bg-gray-100 opacity-80 group-hover:opacity-100 transition"
          >
            <Edit className="h-4 w-4 text-gray-700" />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={hiddenInput}
            className="hidden"
            onChange={(e) => {
              const newFile = e.target.files?.[0];
              if (newFile) replace(file.id, newFile);
            }}
          />
        </>
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={() => cancelUpload(file.id)}
        className={cn(
          "absolute top-1 right-1 p-1 rounded-full bg-white shadow",
          "hover:bg-red-100 opacity-90 group-hover:opacity-100 transition"
        )}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
};

export default UploadImageItem;

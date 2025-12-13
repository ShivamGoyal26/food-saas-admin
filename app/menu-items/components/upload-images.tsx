"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import UploadImageItem from "./upload-image-item";
import { toast } from "sonner";
import useUploadImages from "../hooks/useUploadImages";
import { MenuImage } from "@/schemas/menu";

type Props = {
  menuId: string;
  serverImages?: MenuImage[];
};

export function UploadImages({ menuId, serverImages }: Props) {
  const {
    files,
    uploadImages,
    cancelUpload,
    retry,
    replace,
    deleteMenuItemImage,
  } = useUploadImages(menuId, serverImages);

  const handleDrop = (selectedFiles: File[]) => {
    uploadImages(selectedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <Dropzone
        maxFiles={5 - files.length}
        onDrop={handleDrop}
        onError={(error) => toast.error(error.message)}
        accept={{ "image/*": [] }}
        maxSize={1024 * 1024 * 5} // 5MB
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {/* Uploaded + Uploading Items */}
      <div className="grid grid-cols-3 gap-4">
        {files.map((file) => (
          <UploadImageItem
            key={file.id}
            file={file}
            cancelUpload={cancelUpload}
            retry={retry}
            replace={replace}
            deleteMenuItemImage={deleteMenuItemImage}
          />
        ))}
      </div>
    </div>
  );
}

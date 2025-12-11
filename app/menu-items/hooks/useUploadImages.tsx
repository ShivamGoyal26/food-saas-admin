"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useGetUploadUrl, useAttachImageToMenu } from ".";
import { MenuImage } from "@/schemas/menu";

export type UploadState =
  | "idle"
  | "generating-url"
  | "uploading"
  | "attaching"
  | "completed"
  | "error";

export type CustomFile = {
  id: string;
  file?: File;
  contentLength: number;
  contentType: string;
  state: UploadState;
  error?: string;
  uploadUrl?: string;
  key?: string;
  url?: string;
  isPrimary?: boolean;
  position?: number;
  serverImageId?: string;
};

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_IMAGES = 5;

export default function useUploadImages(
  menuId: string,
  serverImages?: MenuImage[]
) {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const abortControllers = useRef<Record<string, AbortController>>({});
  const { mutateAsync: getUploadUrl } = useGetUploadUrl();
  const { mutateAsync: attachImage } = useAttachImageToMenu();

  // -------------------------------------------------------
  // Hydrate server images (on refresh or edit mode)
  // -------------------------------------------------------
  useEffect(() => {
    if (!serverImages) return;

    const loaded = serverImages.map((img) => ({
      id: img._id ?? crypto.randomUUID(), // safe fallback
      file: undefined,
      contentLength: 0,
      contentType: "image/jpeg",
      state: "completed", // <— literal type, must match UploadState union
      url: img.url,
      key: img.key,
      isPrimary: img.isPrimary,
      position: img.position,
      serverImageId: img._id,
      error: undefined,
      uploadUrl: undefined,
    }));

    setFiles(loaded);
  }, [serverImages]);

  // -------------------------------------------------------
  // File validation
  // -------------------------------------------------------
  const validate = (file?: File): string | null => {
    if (!file) return null;

    if (!ALLOWED.includes(file.type))
      return "Unsupported file. Allowed: JPG, PNG, WEBP.";

    if (file.size > 5 * 1024 * 1024) return `Max file size is 5MB`;

    return null;
  };

  // -------------------------------------------------------
  // Step 1 - Generate signed upload URL
  // -------------------------------------------------------
  const generateUrl = async (file: CustomFile) => {
    update(file.id, { state: "generating-url", error: undefined });

    try {
      const res = await getUploadUrl({
        payload: {
          contentType: file.contentType,
          contentLength: file.contentLength,
        },
        menuId,
      });

      if (!res.uploadUrl || !res.key || !res.url)
        throw new Error("Invalid signed URL response.");

      update(file.id, {
        uploadUrl: res.uploadUrl,
        key: res.key,
        url: res.url,
      });

      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      update(file.id, {
        state: "error",
        error: message || "Failed to generate upload URL",
      });
      throw err;
    }
  };

  // -------------------------------------------------------
  // Step 2 - Upload to S3
  // -------------------------------------------------------
  const uploadToS3 = async (file: CustomFile, uploadUrl: string) => {
    if (!file.file) throw new Error("Missing local file.");

    update(file.id, { state: "uploading" });

    const controller = new AbortController();
    abortControllers.current[file.id] = controller;

    try {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.contentType },
        body: file.file,
        signal: controller.signal,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      update(file.id, {
        state: "error",
        error: message,
      });
      throw err;
    } finally {
      delete abortControllers.current[file.id];
    }
  };

  // -------------------------------------------------------
  // Step 3 - Attach uploaded image to menu item
  // -------------------------------------------------------
  const attachToMenu = async ({
    key,
    url,
    id,
  }: {
    key: string;
    url: string;
    id: string;
  }) => {
    update(id, { state: "attaching" });

    try {
      await attachImage({
        menuId,
        payload: {
          key: key!,
          url: url!,
          isPrimary: files.length === 0,
        },
      });

      update(id, {
        state: "completed",
        file: undefined,
        error: undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      update(id, {
        state: "error",
        error: message || "Failed to attach image",
      });
      throw err;
    }
  };

  // -------------------------------------------------------
  // Main image workflow
  // -------------------------------------------------------
  const process = async (file: CustomFile) => {
    try {
      const { uploadUrl, key, url } = await generateUrl(file);
      await uploadToS3(file, uploadUrl);
      await attachToMenu({ key, url, id: file.id });

      toast.success("Image uploaded & attached.");
    } catch (_) {
      /* error already set in state */
    }
  };

  // -------------------------------------------------------
  // Update helper
  // -------------------------------------------------------
  const update = (id: string, updates: Partial<CustomFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // -------------------------------------------------------
  // Retry upload from failed stage
  // -------------------------------------------------------
  const retry = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;

    if (!file.file && file.state !== "completed") {
      toast.error("Cannot retry — no file present.");
      return;
    }

    update(id, { state: "idle", error: undefined });
    process(file);
  };

  // -------------------------------------------------------
  // Replace image with new file
  // -------------------------------------------------------
  const replace = (id: string, newFile: File) => {
    const validation = validate(newFile);
    if (validation) {
      toast.error(validation);
      return;
    }

    update(id, {
      file: newFile,
      contentLength: newFile.size,
      contentType: newFile.type,
      state: "idle",
      error: undefined,
    });

    process({
      ...files.find((f) => f.id === id)!,
      file: newFile,
      contentLength: newFile.size,
      contentType: newFile.type,
    });
  };

  // -------------------------------------------------------
  // Add new images from Dropzone
  // -------------------------------------------------------
  const uploadImages = (selected: File[]) => {
    if (files.length + selected.length > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed.`);
      return;
    }

    const newFiles = selected.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      contentLength: f.size,
      contentType: f.type,
      state: "idle",
    })) as CustomFile[];

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((f) => process(f));
  };

  const cancelUpload = (id: string) => {
    abortControllers.current[id]?.abort();
    update(id, { state: "error", error: "Upload cancelled" });
  };

  return {
    files,
    uploadImages,
    cancelUpload,
    retry,
    replace,
    update,
  };
}

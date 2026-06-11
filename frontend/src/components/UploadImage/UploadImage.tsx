"use client";

import { ImageOff, ImagePlus, LoaderCircle, X } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "@/services/apiServices";

type Fit = "cover" | "contain";
type PreviewType = "originals" | "thumbnails";
type UploadImageSize = "default" | "small";

interface UploadImageProps {
  accept?: string;
  allowClear?: boolean;
  aspectRatio?: number;
  className?: string;
  disabled?: boolean;
  fit?: Fit;
  height?: number;
  helperText?: ReactNode;
  label?: ReactNode;
  maxSizeMb?: number;
  onChange?: (file: File | null) => void;
  previewType?: PreviewType;
  size?: UploadImageSize;
  value?: File | string | null;
}

const getServerImageUrl = (value: string, previewType: PreviewType) =>
  previewType === "thumbnails"
    ? api.file.getThumbnailUrl(value)
    : api.file.getOriginalImageUrl(value);

export function UploadImage({
  accept = "image/png,image/jpeg,image/webp",
  allowClear = true,
  aspectRatio,
  className = "",
  disabled = false,
  fit = "cover",
  height = 200,
  helperText,
  label,
  maxSizeMb = 5,
  onChange,
  previewType = "originals",
  size = "default",
  value,
}: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<{
    error: boolean;
    loading: boolean;
    url: string | null;
  }>({ error: false, loading: false, url: null });
  const [isDragActive, setIsDragActive] = useState(false);

  const remotePreview =
    typeof value === "string" && value.trim()
      ? getServerImageUrl(value, previewType)
      : null;
  const previewUrl = localPreview ?? remotePreview;
  const canUpload = !disabled && Boolean(onChange);
  const isSmall = size === "small";
  const imageLoadError =
    imageStatus.url === previewUrl ? imageStatus.error : false;
  const isImageLoading =
    Boolean(previewUrl) &&
    (imageStatus.url !== previewUrl || imageStatus.loading);

  useEffect(() => {
    if (!(value instanceof File)) {
      queueMicrotask(() => setLocalPreview(null));
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    queueMicrotask(() => setLocalPreview(objectUrl));

    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const selectFile = (file?: File) => {
    if (!file || !canUpload) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file.");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`Image must be smaller than ${maxSizeMb} MB.`);
      return;
    }

    setLocalError(null);
    setImageStatus({ error: false, loading: Boolean(previewUrl), url: previewUrl });
    onChange?.(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleClear = () => {
    if (!canUpload || !allowClear) {
      return;
    }

    setLocalError(null);
    setImageStatus({ error: false, loading: false, url: null });
    onChange?.(null);
  };

  const message = localError ?? helperText;

  return (
    <div
      className={`flex flex-col gap-1 ${isSmall ? "w-25" : "w-full"} ${className}`}
    >
      {label ? (
        <p className="text-sm font-medium text-[#314032]">{label}</p>
      ) : null}

      <div
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-[#fff8f1]"
        style={{
          aspectRatio,
          minHeight: aspectRatio ? undefined : height,
        }}
      >
        {previewUrl && !imageLoadError ? (
          <>
            {isImageLoading ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <LoaderCircle className="h-7 w-7 animate-spin text-[#805533]" />
              </div>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Image preview"
              className="h-full w-full select-none"
              draggable={false}
              onError={() => {
                setImageStatus({
                  error: true,
                  loading: false,
                  url: previewUrl,
                });
              }}
              onLoad={() =>
                setImageStatus({
                  error: false,
                  loading: false,
                  url: previewUrl,
                })
              }
              src={previewUrl}
              style={{ objectFit: fit }}
            />
          </>
        ) : null}

        {imageLoadError ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center text-[#8a7867]">
            <ImageOff aria-hidden="true" className="h-10 w-10 opacity-60" />
            <p className="text-sm">Failed to load image.</p>
          </div>
        ) : null}

        {!previewUrl && !imageLoadError ? (
          <div
            className={[
              "absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed text-center transition",
              isSmall ? "gap-0.5 p-1" : "gap-2 p-6",
              isDragActive
                ? "border-[#143d2a] bg-[#143d2a]/5"
                : "border-[#d8c8bd] bg-[#fff3e8] hover:border-[#805533]",
              canUpload ? "cursor-pointer" : "cursor-not-allowed opacity-60",
            ].join(" ")}
            onClick={() => canUpload && inputRef.current?.click()}
            onDragEnter={() => canUpload && setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <ImagePlus
              aria-hidden="true"
              className={`${isSmall ? "h-5 w-5" : "h-8 w-8"} text-[#805533]`}
            />
            {isSmall ? null : (
              <>
                <p className="text-sm font-medium text-[#314032]">
                  {isDragActive
                    ? "Drop the image here"
                    : "Click or drag an image to upload"}
                </p>
                <p className="text-xs text-[#8a7867]">
                  PNG, JPG or WebP, maximum {maxSizeMb} MB
                </p>
              </>
            )}
          </div>
        ) : null}

        {allowClear && canUpload && (previewUrl || imageLoadError) ? (
          <button
            aria-label="Remove image"
            className={`absolute z-20 flex items-center justify-center rounded-full bg-red-700 text-white opacity-0 shadow transition hover:bg-red-800 group-hover:opacity-100 ${isSmall
              ? "right-1 top-1 h-5 w-5"
              : "right-2 top-2 h-8 w-8"
              }`}
            onClick={handleClear}
            type="button"
          >
            <X
              aria-hidden="true"
              className={isSmall ? "h-3 w-3" : "h-4 w-4"}
            />
          </button>
        ) : null}
      </div>

      <input
        accept={accept}
        className="hidden"
        disabled={!canUpload}
        onChange={handleInputChange}
        ref={inputRef}
        type="file"
      />

      {message ? (
        <p className={`text-xs ${localError ? "text-red-700" : "text-[#8a7867]"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

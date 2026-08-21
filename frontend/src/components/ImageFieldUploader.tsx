import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Link as LinkIcon, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { compressImageToWebP } from "@/lib/clientCache";
import { toast } from "sonner";

interface ImageFieldUploaderProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  placeholder?: string;
  helperText?: string;
  aspectRatioHint?: string;
}

export function ImageFieldUploader({
  label,
  value,
  onChange,
  placeholder = "https://... or upload from your device",
  helperText,
  aspectRatioHint = "Recommended: 16:9 or 16:10",
}: ImageFieldUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }

    setIsUploading(true);
    try {
      // Compress client-side to optimized WebP
      const compressedWebP = await compressImageToWebP(file, 1600, 1600, 0.85);
      onChange(compressedWebP);
      toast.success("Image uploaded & optimized successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to process image file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="admin-image-uploader-field">
      <div className="admin-image-uploader-header">
        <label className="admin-field-label">{label}</label>
        {aspectRatioHint && (
          <span className="admin-aspect-hint">{aspectRatioHint}</span>
        )}
      </div>

      {value ? (
        // Preview State when an image is selected
        <div className="admin-image-preview-card">
          <div className="admin-image-preview-media">
            <img
              src={value}
              alt="Uploaded visual preview"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/ybi-assets/homepage/ybi-hero.jpg";
              }}
            />
          </div>

          <div className="admin-image-preview-controls">
            <div className="admin-image-preview-status">
              <span className="preview-dot active" />
              <span>Image loaded</span>
            </div>

            <div className="admin-image-preview-actions">
              <button
                type="button"
                className="admin-uploader-btn outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Optimizing...
                  </>
                ) : (
                  <>
                    <Camera size={14} /> Replace Photo
                  </>
                )}
              </button>

              <button
                type="button"
                className="admin-uploader-btn text-link"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <LinkIcon size={14} /> {showUrlInput ? "Hide Link" : "Edit Link"}
              </button>

              <button
                type="button"
                className="admin-uploader-btn danger"
                onClick={() => onChange("")}
                title="Remove image"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {showUrlInput && (
            <div className="admin-image-inline-url">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="admin-modern-input"
              />
            </div>
          )}
        </div>
      ) : (
        // Empty / Upload State
        <div
          className={`admin-image-dropzone ${isDragging ? "is-dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="admin-dropzone-content">
            <div className="admin-dropzone-icon">
              {isUploading ? (
                <Loader2 size={28} className="animate-spin text-blue" />
              ) : (
                <UploadCloud size={28} />
              )}
            </div>

            <div className="admin-dropzone-text">
              <p className="primary-text">
                {isUploading ? (
                  "Optimizing image for fast delivery..."
                ) : (
                  <>
                    <strong>Click to upload</strong> or drag and drop photo from device
                  </>
                )}
              </p>
              <p className="secondary-text">PNG, JPG, WebP or SVG up to 10MB</p>
            </div>

            <div className="admin-dropzone-actions">
              <button
                type="button"
                className="admin-uploader-btn primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera size={15} /> Choose from Device
              </button>

              <button
                type="button"
                className="admin-uploader-btn outline"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <LinkIcon size={14} /> Paste Link
              </button>
            </div>

            {showUrlInput && (
              <div className="admin-image-direct-url-wrap">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="admin-modern-input"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {helperText && <p className="admin-field-helper">{helperText}</p>}
    </div>
  );
}

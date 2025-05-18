"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

type Media = {
  id: number;
  url: string;
  type: "image" | "video";
};

export default function GalleryUploader() {
  const [gallery, setGallery] = useState<Media[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setFile(null);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);

    // Here you send file to your backend API
    // We simulate an upload and return a URL for demo

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Add uploaded media to gallery
      setGallery((prev) => [
        ...prev,
        {
          id: Date.now(),
          url: data.url,
          type: file.type.startsWith("video") ? "video" : "image",
        },
      ]);
      closeModal();
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1a002d] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>

      {/* Gallery grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Upload icon card */}
        <button
          onClick={openModal}
          className="flex items-center justify-center border-2 border-dashed border-gold rounded-lg h-32 text-gold text-5xl font-bold hover:bg-gold hover:text-[#1a002d] transition"
          aria-label="Upload media"
          title="Upload media"
        >
          +
        </button>

        {/* Render uploaded media */}
        {gallery.map(({ id, url, type }) => (
          <div key={id} className="rounded overflow-hidden border border-gray-700">
            {type === "image" ? (
              <>
                <Image src={url} alt="uploaded" width={300} height={128} className="w-full h-32 object-cover" />
                <img src={url} alt="uploaded" className="w-full h-32 object-cover" />
              </>
            ) : (
              <video controls className="w-full h-32 object-cover">
                <source src={url} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Modal popup */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-[#2a004d] p-6 rounded max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Upload Image or Video</h2>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              ref={inputRef}
              className="mb-4 text-white"
            />
            {file && (
              <p className="mb-4 text-sm">
                Selected file: <strong>{file.name}</strong>
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                disabled={uploading}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={uploadFile}
                disabled={!file || uploading}
                className="px-4 py-2 rounded bg-gold text-[#1a002d] font-semibold hover:bg-yellow-500 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

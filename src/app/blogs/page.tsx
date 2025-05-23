'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BlogsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaURLs, setMediaURLs] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token || token !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      const input = prompt('Enter Admin Secret');
      if (input === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
        localStorage.setItem('adminToken', input);
        setIsAdmin(true);
      }
    } else {
      setIsAdmin(true);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles(files);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    mediaFiles.forEach(file => formData.append('files', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setMediaURLs([...mediaURLs, ...data.urls]);
      setMediaFiles([]);
      setShowModal(false);
    }
  };

  const handleDelete = async (url: string) => {
    const key = url.split('.com/')[1];
    const res = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    if (res.ok) {
      setMediaURLs(prev => prev.filter(u => u !== url));
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b from-purple-900 to-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Blogs Gallery</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2 rounded shadow-lg transition transform hover:scale-105"
          >
            ⬆ Upload
          </button>
        )}
      </div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {mediaURLs.map((url, idx) => (
          <motion.div key={idx} className="relative overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-white/10 backdrop-blur-md p-1 hover:scale-105 transition-transform duration-300">
            {/\.(jpe?g|png|gif|webp)$/i.test(url) ? (
              <div className="relative w-full h-72 rounded-xl overflow-hidden">
                <Image
                  src={url}
                  alt={`Media ${idx}`}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            ) : (
              <video controls className="w-full h-72 object-cover rounded-xl">
                <source src={url} />
              </video>
            )}
            {isAdmin && (
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
              >
                ✖
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Media</h2>
            <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-4 h-40 flex flex-col justify-center items-center hover:border-blue-600 transition-all">
              <span className="text-sm text-gray-600">Drag & drop or click to upload</span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BlogsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaURLs, setMediaURLs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    // Quick dev: if you used the admin token before, keep admin logged in
    if (token === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAdmin(true);
    }
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaURLs(data.urls || []);
      } else {
        console.warn('Failed to fetch media list');
      }
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (isAdmin) {
      setShowUploadModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = () => {
    // Quick dev flow: compare to NEXT_PUBLIC_ADMIN_SECRET
    if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      localStorage.setItem('adminToken', adminPassword);
      setIsAdmin(true);
      setShowPasswordModal(false);
      setShowUploadModal(true);
      setAdminPassword('');
    } else {
      alert('Incorrect admin password.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles(files);
    }
  };

  const handleUpload = async () => {
    if (mediaFiles.length === 0) return alert('Please select files to upload.');
    const formData = new FormData();
    mediaFiles.forEach((f) => formData.append('files', f));

    try {
      const token = localStorage.getItem('adminToken') || '';
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // after upload, refresh canonical list
        await fetchMedia();
        setMediaFiles([]);
        setShowUploadModal(false);
      } else {
        const err = await res.json().catch(() => null);
        console.error('Upload failed', err);
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload error');
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      const token = localStorage.getItem('adminToken') || '';
      const res = await fetch(`/api/media?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchMedia();
      } else {
        const err = await res.json().catch(() => null);
        console.error('Delete failed', err);
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Delete error');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#fdfdfd] text-[#111]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📸 Blogs Media Gallery</h1>
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Upload Media
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading media...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {mediaURLs.map((url, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              {/\.(jpe?g|png|gif|webp)$/i.test(url) ? (
                <div className="relative w-full h-72">
                  <Image
                    src={url}
                    alt={`Media ${idx}`}
                    fill
                    className="object-cover"
                    sizes="100%"
                    unoptimized // remove if you configured next.config.js for your S3 domain
                  />
                </div>
              ) : (
                <video controls className="w-full h-72 object-cover bg-black" preload="metadata">
                  <source src={url} />
                  Sorry, your browser doesn&apos;t support embedded videos.
                </video>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleDelete(url)}
                  title="Delete media"
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded-full shadow-md"
                >
                  ✖
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
            <input type="password" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handlePasswordSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Media</h2>
            <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-4 h-40 flex flex-col justify-center items-center hover:border-blue-600 transition-all cursor-pointer">
              <span className="text-sm text-gray-500">Drag & drop or click to upload</span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleUpload} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Upload</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

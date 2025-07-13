// src/components/AddPublicationPage.jsx

import React, { useState } from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/publicationService";

export default function AddPublicationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const { addPublication } = usePublications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !releaseDate) {
      alert("Judul dan Tanggal Rilis harus diisi!");
      return;
    }
    let coverUrl = "";
    if (coverFile) {
      try {
        coverUrl = await uploadImageToCloudinary(coverFile);
      } catch (error) {
        console.error("Gagal mengunggah gambar:", error);
        alert("Gagal mengunggah gambar. Silakan coba lagi.");
        return;
      }
    } else {
      coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(
        title
      )}`;
    }
    const newPublication = {
      title,
      releaseDate,
      description,
      coverUrl,
    };
    try {
      await addPublication(newPublication);
      navigate("/publications");
      setTitle("");
      setReleaseDate("");
      setDescription(""); // Pastikan description juga di-reset
      setCoverFile(null);
    } catch (error) {
      console.error("Gagal menambahkan publikasi:", error);
      alert("Gagal menambahkan publikasi. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-xl shadow-lg bg-white border border-blue-100 transform transition-transform duration-300 hover:scale-[1.01]"> 
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center"> 
        Form Tambah Publikasi Baru
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-1" 
          >
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            placeholder="Contoh: Indikator Ekonomi Kalimantan Selatan 2025" 
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-1" 
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            rows={4}
            required
          />
        </div>
        <div>
          <label
            htmlFor="releaseDate"
            className="block text-sm font-semibold text-gray-700 mb-1" 
          >
            Tanggal Rilis
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            required
          />
        </div>
        <div>
          <label
            htmlFor="cover"
            className="block text-sm font-semibold text-gray-700 mb-1" 
          >
            Sampul (Gambar)
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /* Perubahan: styling input file */
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105" /* Perubahan: warna, hover effect */
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}

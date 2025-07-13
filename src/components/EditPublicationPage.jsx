// src/components/EditPublicationPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";
import {
  publicationService,
  uploadImageToCloudinary,
} from "../services/publicationService";

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications, editPublication } = usePublications();
  const initialPublication = publications.find((pub) => pub.id === Number(id));

  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    description: "",
    coverFile: null,
    coverUrlToSave: null,
    currentCoverUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialPublication) {
      setFormData({
        title: initialPublication.title || "",
        releaseDate: initialPublication.releaseDate || "",
        description: initialPublication.description || "",
        coverFile: null,
        coverUrlToSave: initialPublication.coverUrl || null,
        currentCoverUrl: initialPublication.coverUrl || "",
      });
    } else {
      const fetchPub = async () => {
        try {
          const fetchedPub = await publicationService.getPublicationById(id);
          setFormData({
            title: fetchedPub.title || "",
            releaseDate: fetchedPub.releaseDate || "",
            description: fetchedPub.description || "",
            coverFile: null,
            coverUrlToSave: fetchedPub.coverUrl || null,
            currentCoverUrl: fetchedPub.coverUrl || "",
          });
        } catch (err) {
          console.error("Gagal mengambil publikasi:", err);
          alert("Gagal memuat detail publikasi. Silakan coba lagi.");
          navigate("/publications");
        }
      };
      if (id) {
        fetchPub();
      }
    }
  }, [initialPublication, id, navigate, publications]); // Tambahkan publications ke dependency array

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "coverFile" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, coverFile: file }));
      setFormData((prev) => ({
        ...prev,
        currentCoverUrl: URL.createObjectURL(file),
      }));

      setIsUploading(true);
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setFormData((prev) => ({ ...prev, coverUrlToSave: uploadedUrl }));
        console.log("Gambar berhasil diunggah ke Cloudinary:", uploadedUrl);
      } catch (uploadError) {
        console.error("Gagal mengunggah gambar ke Cloudinary:", uploadError);
        alert("Gagal mengunggah gambar. Silakan coba lagi.");
        setFormData((prev) => ({
          ...prev,
          coverFile: null,
          coverUrlToSave: null,
          currentCoverUrl: initialPublication ? initialPublication.coverUrl : "", // Kembali ke cover awal jika upload gagal
        }));
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      alert("Mohon tunggu, gambar sedang diunggah.");
      return;
    }
    if (!formData.title || !formData.releaseDate || !formData.description) {
      alert("Judul, Tanggal Rilis, dan Deskripsi harus diisi!");
      return;
    }

    const dataToSend = {
      title: formData.title,
      releaseDate: formData.releaseDate,
      description: formData.description,
      coverUrl: formData.coverUrlToSave,
    };

    try {
      const updatedFromBackend = await publicationService.updatePublication(
        id,
        dataToSend
      );
      editPublication(updatedFromBackend);
      navigate("/publications");
    } catch (error) {
      console.error("Error updating publication:", error);
      alert(error.message || "Gagal memperbarui publikasi.");
    }
  };

  if (!initialPublication && !formData.title && !formData.description) {
    return <div className="text-center mt-10">Memuat publikasi...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 transform transition-transform duration-300 hover:scale-[1.01]"> {/* Perubahan: gradien, border, hover effect */}
      <h1 className="text-3xl font-extrabold text-indigo-800 mb-8 text-center"> {/* Perubahan: ukuran, warna, tengah */}
        Edit Publikasi
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
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors" /* Perubahan: border, focus ring */
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors" /* Perubahan: border, focus ring */
            placeholder="Masukkan deskripsi publikasi..."
            required
          ></textarea>
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
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors" /* Perubahan: border, focus ring */
            required
          />
        </div>
        <div>
          <label
            htmlFor="coverFile"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Sampul (Gambar)
          </label>
          <input
            type="file"
            id="coverFile"
            name="coverFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors" /* Perubahan: styling input file */
            disabled={isUploading}
          />
          {isUploading && (
            <p className="text-sm text-indigo-600 mt-1">Mengunggah gambar mohon tunggu sebentar...</p> /* Warna teks */
          )}
          {formData.currentCoverUrl && (
            <img
              src={formData.currentCoverUrl}
              alt="Sampul"
              className="h-28 w-auto mt-4 rounded-lg shadow-md object-cover border border-gray-200" /* Perubahan: ukuran, border, shadow */
            />
          )}
        </div>
        <div className="flex justify-end space-x-3"> {/* Perubahan: space-x */}
          <button
            type="button"
            onClick={() => navigate("/publications")}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105" /* Perubahan: warna, hover effect */
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105" /* Perubahan: warna, hover effect */
            disabled={isUploading}
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

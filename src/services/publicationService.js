// src/services/publicationService.js
import apiClient from '../api/axios'; // Ini akan dibuat nanti di 14.4.3 Langkah 3

export const publicationService = {
  async addPublication (newPublication) {
    try {
      const response = await apiClient.post('/publikasi', newPublication);
      return response.data;
    } catch (error) {
      throw new Error('Gagal menambahkan data: ' + error.response?.data?.message || 'Terjadi kesalahan');
    }
  },
  async getPublications () {
    try {
      const response = await apiClient.get('/publikasi');
      // Pastikan data yang dikembalikan selalu array, bahkan jika API mengembalikan null/kosong
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error('Gagal mengambil data: ' + error.response?.data?.message || 'Terjadi kesalahan');
    }
  },
  // Tambahkan fungsi updatePublication (akan diimplementasikan lebih detail nanti)
  async updatePublication(id, updatedPublication) {
    try {
      // Menggunakan method PUT untuk update, sesuaikan jika backend Anda menggunakan POST
      const response = await apiClient.put(`/publikasi/${id}`, updatedPublication);
      return response.data;
    } catch (error) {
      throw new Error('Gagal memperbarui data: ' + error.response?.data?.message || 'Terjadi kesalahan');
    }
  },
  // Tambahkan fungsi deletePublication (akan diimplementasikan lebih detail nanti)
  async deletePublication(id) {
    try {
      await apiClient.delete(`/publikasi/${id}`);
      return true;
    } catch (error) {
      throw new Error('Gagal menghapus data: ' + error.response?.data?.message || 'Terjadi kesalahan');
    }
  }
}

// Fungsi untuk upload gambar ke Cloudinary
export async function uploadImageToCloudinary (file) {
  const formData = new FormData();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary config missing: cek VITE_CLOUDINARY_UPLOAD_PRESET dan VITE_CLOUDINARY_CLOUD_NAME di .env');
  }

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload gagal');
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Gagal upload ke Cloudinary: ' + error.message);
  }
}
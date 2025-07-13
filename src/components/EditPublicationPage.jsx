// src/components/EditPublicationPage.jsx
import React, { useState, useEffect } from 'react';
import { usePublications } from '../hooks/usePublications'; // Impor usePublications
import { useNavigate, useParams } from 'react-router-dom'; // Impor useNavigate dan useParams

export default function EditPublicationPage() {
  const { publications, editPublication } = usePublications(); // Dapatkan data dan fungsi dari hook
  const navigate = useNavigate();
  const { id } = useParams(); // Dapatkan ID publikasi dari URL

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');

  // Mengisi form dengan data publikasi yang ada saat komponen dimuat
  useEffect(() => {
    const publicationToEdit = publications.find(pub => pub.id === parseInt(id));
    if (publicationToEdit) {
      setTitle(publicationToEdit.title);
      setDescription(publicationToEdit.description || '');
      setReleaseDate(publicationToEdit.releaseDate);
      setCoverPreviewUrl(publicationToEdit.coverUrl);
    } else {
      // Jika publikasi tidak ditemukan, redirect atau tampilkan pesan error
      navigate('/publications');
    }
  }, [id, publications, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !releaseDate) {
      alert('Judul dan Tanggal Rilis harus diisi!');
      return;
    }

    let finalCoverUrl = coverPreviewUrl; // Default ke cover yang sudah ada
    if (coverFile) {
      finalCoverUrl = URL.createObjectURL(coverFile); // Jika ada file baru dipilih
    }

    const updatedPublication = {
      id: parseInt(id), // Pastikan ID adalah integer
      title,
      description,
      releaseDate,
      coverUrl: finalCoverUrl,
    };

    editPublication(updatedPublication);
    navigate('/publications');
  };

  const handleCancel = () => {
    navigate('/publications'); // Kembali ke halaman daftar publikasi
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      // Jika tidak ada file baru, kembali ke cover asli atau placeholder
      const publicationToEdit = publications.find(pub => pub.id === parseInt(id));
      setCoverPreviewUrl(publicationToEdit ? publicationToEdit.coverUrl : '');
    }
  };

  // Pastikan publikasi ditemukan sebelum merender form
  const publicationExists = publications.some(pub => pub.id === parseInt(id));

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
      {publicationExists ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              placeholder="Contoh: Indikator Ekonomi Bengkulu 2025"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              placeholder="Contoh: Publikasi ini membahas Indikator Ekonomi Bengkulu secara mendalam."
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={e => setReleaseDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {coverPreviewUrl && (
              <div className="mt-4 flex justify-center">
                <img src={coverPreviewUrl} alt="Cover Preview" className="max-h-48 rounded-md shadow-md" />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-600">Publikasi tidak ditemukan.</p>
      )}
    </div>
  );
}
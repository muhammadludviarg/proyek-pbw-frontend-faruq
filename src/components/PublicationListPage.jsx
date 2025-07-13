// src/components/PublicationListPage.jsx

import React from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

export default function PublicationListPage() {
  const { publications, loading, error, deletePublication } = usePublications(); 
  const navigate = useNavigate();

  const handleDelete = async (id, title) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus publikasi "${title}"?`)
    ) {
      try {
        await deletePublication(id);
        alert("Publikasi berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus publikasi:", error);
        alert("Gagal menghapus publikasi. Silakan coba lagi.");
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-10 text-lg">Memuat daftar publikasi...</p>;
  if (error) return <p className="text-center text-red-600 mt-10 text-lg">Error: {error}</p>;
  if (!publications || publications.length === 0) return <p className="text-center text-gray-600 mt-10 text-lg">Belum ada publikasi. Tambahkan yang baru!</p>;


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white rounded-lg shadow-xl border border-blue-100"> 
      <header className="mb-10 text-center"> 
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-2"> 
          Daftar Publikasi BPS Provinsi Kalimantan Selatan 
        </h1>
        <p className="text-gray-600 text-lg">Sumber data publikasi terkini dari BPS.</p> 
      </header>

      <div className="relative overflow-x-auto rounded-lg border border-gray-200"> 
        <table className="w-full text-base text-left text-gray-700"> 
          <thead className="text-sm text-white uppercase bg-indigo-700"> 
            <tr>
              {/* Perbaikan whitespace text nodes: Menghilangkan spasi atau newline di antara <th> tags */}
              <th scope="col" className="px-6 py-3 text-center w-16">No</th><th scope="col" className="px-6 py-3">Judul</th><th scope="col" className="px-6 py-3">Deskripsi</th><th scope="col" className="px-6 py-3">Tanggal Rilis</th><th scope="col" className="px-6 py-3 text-center">Sampul</th><th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub, idx) => (
              <tr
                key={pub.id}
                className="bg-white border-b border-gray-100 hover:bg-indigo-50 transition-colors duration-200" 
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{pub.title}</td>
                <td
                  className="px-6 py-4 text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" 
                  title={pub.description}
                >
                  {pub.description || 'Tidak ada deskripsi'}
                </td>
                <td className="px-6 py-4 text-gray-700">{pub.releaseDate}</td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <img
                    src={pub.coverUrl}
                    alt={`Sampul ${pub.title}`}
                    className="h-28 w-auto object-cover rounded-md shadow-sm border border-gray-100" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x140/cccccc/ffffff?text=Error";
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <Link 
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 transform hover:scale-105" 
                    to={`/publications/edit/${pub.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 transform hover:scale-105" 
                    onClick={() => handleDelete(pub.id, pub.title)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

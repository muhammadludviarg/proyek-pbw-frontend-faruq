// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../hooks/useAuth"; // Import useAuth
import LogoBPS from '../assets/LogoBPS1.png'; // Pastikan path logo Anda benar

const navItems = [
  { id: "publications", label: "Daftar Publikasi", path: "/publications" },
  { id: "add", label: "Tambah Publikasi", path: "/publications/add" },
  { id: "logout", label: "Logout", path: "/logout" }, // Path ini hanya sebagai placeholder, logout akan ditangani oleh handleLogout
];

function BpsLogo() {
  return (
    <img
      src={LogoBPS} // Menggunakan variabel LogoBPS yang diimpor
      alt="BPS Logo"
      className="h-12 w-12"
    />
  );
}

export default function Navbar() {
  const location = useLocation();
  const { logoutAction } = useAuth(); // Dapatkan logoutAction dari useAuth
  const navigate = useNavigate(); // Dapatkan navigate

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await logoutAction(); // Panggil logoutAction dari AuthContext
        navigate('/login'); // Redirect ke halaman login setelah logout berhasil
      } catch (error) {
        console.error('Failed to logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
      }
    }
  };

  // Jangan tampilkan navbar di halaman login
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-[#0369A1] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BpsLogo />
            <span className="text-white text-base md:text-lg font-bold tracking-wider hidden sm:block">
              BPS PROVINSI BENGKULU
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.id === "add" && location.pathname.startsWith("/publications/add")) ||
                (item.id === "publications" && location.pathname === "/publications");

              if (item.id === "logout") {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout} // Panggil handleLogout saat tombol diklik
                    className="px-3 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 border border-transparent cursor-pointer ${
                    isActive
                      ? "bg-white text-sky-900 shadow-md font-bold"
                      : "text-sky-100 hover:bg-sky-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

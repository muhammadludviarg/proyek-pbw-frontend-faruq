// src/components/Navbar.jsx

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoBPS from "../assets/LogoBPS1.png"; 

const navItems = [
  { id: "publications", label: "Daftar Publikasi", path: "/publications" },
  { id: "add", label: "Tambah Publikasi", path: "/publications/add" },
];

function BpsLogo() {
  return (
    <img
      src={logoBPS}
      alt="BPS Logo"
      className="h-12 w-12"
    />
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAction, isAuthenticated } = useAuth(); // Pastikan isAuthenticated didapatkan dari useAuth

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await logoutAction();
        navigate("/login");
      } catch (error) {
        console.error("Gagal logout:", error);
        alert("Gagal logout. Silakan coba lagi.");
      }
    }
  };

  // Jangan tampilkan navbar di halaman login
  if (location.pathname === "/login") {
    return null;
  }

  return (
    // Navbar dengan latar belakang dan bayangan yang lebih sederhana
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BpsLogo />
            <span
              className="text-gray-800 text-base md:text-lg font-bold tracking-wider hidden sm:block"
            >
              BPS PROVINSI KALIMANTAN SELATAN
            </span> 
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && ( // Tampilkan item navigasi dan logout jika terautentikasi
              <>
                {navItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.id === "add" &&
                      location.pathname.startsWith("/publications/add")) ||
                    (item.id === "publications" &&
                      location.pathname === "/publications");

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium
                                 transition-colors duration-300 border border-transparent cursor-pointer ${
                                   isActive
                                     ? "bg-sky-100 text-sky-800 font-bold"
                                     : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                 }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 cursor-pointer shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && ( // Tampilkan tombol Login jika belum terautentikasi
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300 cursor-pointer shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

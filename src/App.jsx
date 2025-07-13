import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"; // Import Outlet
import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import EditPublicationPage from "./components/EditPublicationPage";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      
      <Routes>
       
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}> {/* ProtectedRoute di dalam MainLayout */}
            <Route path="/publications" element={<PublicationListPage />} />
            <Route path="/publications/add" element={<AddPublicationPage />} />
            <Route path="/publications/edit/:id" element={<EditPublicationPage />} />
            <Route path="/" element={<Navigate to="/publications" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}


const MainLayout = () => {
  const location = useLocation(); 
  return (
    <>
      <Navbar /> 
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

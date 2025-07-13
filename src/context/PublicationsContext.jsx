import React, { createContext, useState, useEffect } from "react";
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      // Hanya fetch data jika ada token (sudah login)
      if (!token) {
        setLoading(false); // Pastikan loading false jika tidak ada token
        setPublications([]); // Kosongkan daftar jika tidak login
        return;
      }
      setLoading(true);
      try {
        const data = await publicationService.getPublications();
        setPublications(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch publications error:", err); // Log error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]); // Re-fetch saat token berubah (login/logout)

  const addPublication = async (newPub) => {
    try {
      const added = await publicationService.addPublication(newPub);
      setPublications((prev) => [added, ...prev]);
      setError(null);
      return added;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  
  const editPublication = (updatedPubFromBackend) => { 
    setPublications((prev) =>
      prev.map((pub) => (pub.id === updatedPubFromBackend.id ? updatedPubFromBackend : pub))
    );
    setError(null);
  };

  const deletePublication = async (id) => {
    try {
      await publicationService.deletePublication(id);
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <PublicationContext.Provider
      value={{
        publications,
        loading,
        error,
        addPublication,
        editPublication, 
        deletePublication,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export { PublicationContext, PublicationProvider };

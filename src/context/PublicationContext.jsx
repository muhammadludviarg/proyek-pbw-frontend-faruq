// src/context/PublicationContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setPublications([]); // Pastikan ini tetap array kosong
        return;
      }
      setLoading(true);
      try {
        const data = await publicationService.getPublications();
        // Pastikan data yang diterima dari API adalah array. Jika tidak, konversikan.
        setPublications(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPublications([]); // Jika error, set ke array kosong untuk mencegah crash
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

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

  const editPublication = async (updatedPub) => {
    try {
      const response = await publicationService.updatePublication(updatedPub.id, updatedPub);
      setPublications(prev => prev.map(pub => pub.id === updatedPub.id ? response : pub));
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePublication = async (id) => {
    try {
      await publicationService.deletePublication(id);
      setPublications(prev => prev.filter(pub => pub.id !== id));
      setError(null);
      return true;
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
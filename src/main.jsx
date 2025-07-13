// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { PublicationProvider } from "./context/PublicationContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import AuthProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider> {/* Bungkus dengan AuthProvider */}
        <PublicationProvider>
          <App />
        </PublicationProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
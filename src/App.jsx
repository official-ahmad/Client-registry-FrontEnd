import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Sidebar from "./Sidebar";
import Dashboard from "./DashboardNew";
import AddJob from "./AddJob";
import Revenue from "./Revenue";
import LoginPage from "./LoginPage";
import { clearAuthSession, isAuthenticated as hasStoredSession } from "./auth";
import toast from "react-hot-toast";

function ProtectedShell({ onLogout }) {
  return (
    <>
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 min-w-0 lg:ml-64 pt-16 lg:pt-0">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddJob />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredSession());

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(hasStoredSession());

    window.addEventListener("auth:changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth:changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <div
                className={`flex min-h-screen overflow-x-hidden transition-colors duration-200 ${
                  isDark
                    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
                    : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
                }`}
              >
                <ProtectedShell onLogout={handleLogout} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? "#1f2937" : "#ffffff",
            color: isDark ? "#fff" : "#1f2937",
            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
          },
          success: {
            iconTheme: {
              primary: "#06b6d4",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

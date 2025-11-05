import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "context/Auth/AuthProvider";
import { CacheProvider } from "context/Cache/CacheProvider";
import ProtectedRoute from "components/ProtectedRoute";
import LoginPage from "pages/LoginPage";
import FeedPage from "pages/FeedPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CacheProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CacheProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

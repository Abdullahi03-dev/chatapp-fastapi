import { Navigate } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuth(false);
      return;
    }

    api.get("/auth/decrypt")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!auth) return <Navigate to="/auth" replace />;

  return children;
}

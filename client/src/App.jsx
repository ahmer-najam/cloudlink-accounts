import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Finance from "./pages/Finance.jsx";
import Investors from "./pages/Investors.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import { fetchSettings } from "./services/api.js";
import { setCurrencyPreference } from "./utils/format.js";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadInitialSettings = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await fetchSettings();
        setCurrencyPreference({ currency: data.currency, locale: data.locale || "en-US" });
      } catch (_error) {
        // Keep defaults when settings API is unavailable.
      }
    };
    loadInitialSettings();
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <div className="o-web">
        {isAuthenticated ? <Navbar /> : null}
        <main className="o-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/investors" element={<ProtectedRoute><Investors /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredPermission="settingsManage"><Settings /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requiredPermission="usersManage"><Users /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

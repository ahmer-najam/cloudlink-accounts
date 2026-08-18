import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, apiUpdateMe, setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

const permissionsByRole = {
  admin: {
    financeWrite: true,
    investorsWrite: true,
    settingsManage: true,
    usersManage: true
  },
  manager: {
    financeWrite: true,
    investorsWrite: true,
    settingsManage: false,
    usersManage: false
  },
  viewer: {
    financeWrite: false,
    investorsWrite: false,
    settingsManage: false,
    usersManage: false
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("app_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async (existingToken) => {
    if (!existingToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    setAuthToken(existingToken);
    try {
      const { data } = await apiMe();
      setUser(data);
    } catch (_error) {
      localStorage.removeItem("app_token");
      setAuthToken("");
      setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe(token);
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem("app_token", data.token);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("app_token");
    setAuthToken("");
    setToken("");
    setUser(null);
  };

  const refreshMe = async () => {
    const { data } = await apiMe();
    setUser(data);
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await apiUpdateMe(payload);
    setUser(data);
    return data;
  };

  const permissions = useMemo(
    () => permissionsByRole[user?.role] || permissionsByRole.viewer,
    [user?.role]
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        refreshMe,
        updateProfile,
        isAuthenticated: Boolean(token && user),
        permissions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

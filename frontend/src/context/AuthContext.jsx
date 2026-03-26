import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("nexcv_token"));

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("nexcv_token");
      if (savedToken) {
        try {
          const profile = await authService.getProfile(savedToken);
          setUser(profile);
          setToken(savedToken);
        } catch {
          localStorage.removeItem("nexcv_token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    localStorage.setItem("nexcv_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    localStorage.setItem("nexcv_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nexcv_token");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isEmployer: user?.role === "employer" || user?.role === "recruiter",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

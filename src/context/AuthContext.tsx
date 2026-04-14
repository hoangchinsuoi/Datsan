import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User, AuthUser } from "../types";
import { authService, type RegisterRequest } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVATAR_PLACEHOLDER =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

function mapAuthUserToUser(a: AuthUser): User {
  const roleLower = a.role.toLowerCase();
  return {
    id: String(a.userId),
    name: a.fullName,
    email: a.email,
    phone: "",
    avatar: AVATAR_PLACEHOLDER,
    position: a.role,
    role: roleLower === "admin" ? "admin" : "user",
  };
}

function persistSession(auth: AuthUser) {
  const user = mapAuthUserToUser(auth);
  localStorage.setItem("token", auth.token);
  localStorage.setItem("user", JSON.stringify(user));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const auth = await authService.login({ email, password });
      persistSession(auth);
      setUser(mapAuthUserToUser(auth));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const auth = await authService.register(data);
      persistSession(auth);
      setUser(mapAuthUserToUser(auth));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
};

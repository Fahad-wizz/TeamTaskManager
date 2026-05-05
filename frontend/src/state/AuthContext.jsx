import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ttm_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("ttm_token")));

  useEffect(() => {
    if (!localStorage.getItem("ttm_token")) return;

    api("/auth/me")
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem("ttm_user", JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem("ttm_token");
        localStorage.removeItem("ttm_user");
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  async function authenticate(path, payload) {
    const data = await api(path, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("ttm_token", data.token);
    localStorage.setItem("ttm_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      booting,
      login: (payload) => authenticate("/auth/login", payload),
      signup: (payload) => authenticate("/auth/signup", payload),
      logout,
      isAdmin: user?.role === "admin"
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

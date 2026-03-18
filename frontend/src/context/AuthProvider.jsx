import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../lib/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signup(name, email, password) {
    const res = await api.post("/auth/signup", { name, email, password });
    setUser(res.data.user);
  }

  async function signin(email, password) {
    const res = await api.post("/auth/signin", { email, password });
    setUser(res.data.user);
  }

  async function signout() {
    await api.post("/auth/signout");
    setUser(null);
  }

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

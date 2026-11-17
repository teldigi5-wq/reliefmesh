import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest, clearToken, getToken, setToken } from "@/api/client";

export type Role = "CITIZEN" | "RESPONDER" | "OPERATOR" | "ADMIN" | "ORGANISATION";

interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

interface LoginResponse extends SessionUser {
  token: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, a token may already be in SecureStore from a previous
  // session. There's no "whoami" endpoint on the backend yet, so this just
  // checks a token is present; a token that has since expired or belongs to
  // a deactivated user gets caught on the first real API call, same as the
  // web app's getSession() does server-side.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      // No lightweight session-check endpoint exists yet; rather than
      // invent one, fall back to requiring a fresh login on app restart.
      // Good enough for a first slice — see README "Known gaps".
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await setToken(data.token);
    setUser({ id: data.id, email: data.email, role: data.role });
  }

  async function register(input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const data = await apiRequest<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: input,
    });
    await setToken(data.token);
    setUser({ id: data.id, email: data.email, role: data.role });
  }

  async function logout() {
    await clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() must be used inside <AuthProvider>");
  return ctx;
}

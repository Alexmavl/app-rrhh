import { createContext } from "react";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

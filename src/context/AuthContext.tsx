import { createContext, useContext, useState, ReactNode } from 'react';

interface User { id: string; name: string; email: string; role: 'ADMIN' | 'STAFF' | 'WORKER' }

interface AuthContextType {
  user: User | null;
  token: string | null;
  signin: (token: string, user: User) => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const signin = (t: string, u: User) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, signin, signout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

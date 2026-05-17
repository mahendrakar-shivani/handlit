import { createContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const getStoredUser = (): User | null => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (user: User, token: string) => {
  const normalizedUser = { ...user, role: user.role.toLowerCase() }; // ✅ normalize once
  setUser(normalizedUser);
  setToken(token);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  localStorage.setItem('userRole', normalizedUser.role);
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');        // ✅ ADD THIS
    localStorage.removeItem('providerToken');   // ✅ ADD THIS
    localStorage.removeItem('provider');        // ✅ ADD THIS
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
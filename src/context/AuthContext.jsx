import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data) => {
    // Estructura completa del usuario con token
    const userData = {
      _id: data._id,
      user_name: data.user_name,
      email: data.email,
      role: data.role,
      status: data.status,
      organization_id: data.organization_id || null,
      token: data.token,
      profile: data.profile || {}
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Verificar si el token existe al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // Si hay usuario pero no token, limpiar todo
    if (savedUser && !token) {
      console.warn('Usuario sin token, limpiando localStorage');
      localStorage.removeItem('user');
      setUser(null);
    }
    
    // Si hay token pero no usuario, limpiar todo
    if (token && !savedUser) {
      console.warn('Token sin usuario, limpiando localStorage');
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

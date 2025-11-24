import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isStudentView, setIsStudentView] = useState(false);

  const login = (data) => {
    // data espera recibir: { access_token, user }
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const logout = () => {
    setUser(null);
    setIsStudentView(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  const toggleStudentView = () => {
      setIsStudentView(prev => !prev);
  };

  // Opcional: Verificar expiración del token al cargar
  useEffect(() => {
     const token = localStorage.getItem('token');
     // Aquí podríamos decodificar el token para ver si expiró,
     // pero por simplicidad dejamos que el interceptor maneje el 401.
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isStudentView, toggleStudentView }}>
      {children}
    </AuthContext.Provider>
  );
}

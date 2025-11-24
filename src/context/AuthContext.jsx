import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

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

  return (
    <AuthContext.Provider value={{ user, login, logout, isStudentView, toggleStudentView }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Importa los estilos

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/topics');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user_name || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await axios.post('/auth/login', { user_name, password });
      login(res.data);
      navigate('/topics');
    } catch (err) {
      // Manejar diferentes tipos de errores
      const errorMessage = err.response?.data?.message;
      
      if (errorMessage) {
        // Mensajes específicos del backend
        if (errorMessage.includes('pending')) {
          setError('⏳ Tu cuenta aún no ha sido aprobada. Un administrador revisará tu solicitud en un máximo de 24 horas. Por favor, intenta más tarde.');
        } else if (errorMessage.includes('rejected')) {
          setError('❌ Tu solicitud de registro fue rechazada. Si crees que esto es un error, contacta al administrador.');
        } else if (errorMessage.includes('not active')) {
          setError('⚠️ Tu cuenta no está activa. Contacta al administrador para más información.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('❌ Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">🔒</div>
          <h2>Iniciar Sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta de CiberEduca</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">👤 Usuario</label>
            <input
              id="username"
              className="login-input"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">🔑 Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            → Entrar
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}


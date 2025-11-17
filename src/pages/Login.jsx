import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user_name || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await axios.post('/auth/login', { user_name, password });
      
      // El backend devuelve { access_token, user }
      const { access_token, user: userData } = res.data;
      
      // Validar estado del usuario
      if (userData.status === 'pending') {
        setError('⏳ Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos cuando sea aprobada.');
        return;
      }
      
      if (userData.status === 'suspended') {
        setError('🚫 Tu cuenta ha sido suspendida. Contacta al administrador para más información.');
        return;
      }
      
      if (userData.status === 'rejected') {
        setError('❌ Tu solicitud de registro fue rechazada. Contacta al administrador para más información.');
        return;
      }

      // Login exitoso - combinar user data con token
      login({ ...userData, token: access_token });
      
      // Redirigir según rol
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'revisor') {
        navigate('/revisor/review');
      } else {
        navigate('/topics');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('❌ Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
      } else {
        setError('❌ Error al iniciar sesión. Por favor intenta nuevamente.');
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
          <p>¿No tienes cuenta? <a href="/signup">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
}


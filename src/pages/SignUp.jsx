import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

export default function SignUp() {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('estudiante');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (password) {
      setPasswordStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      });
    }
  }, [password]);

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(val => val === true);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!user_name || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (user_name.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (!isPasswordValid()) {
      setError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post('/users', { user_name, password, role });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario. El nombre de usuario puede estar en uso.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <div className="signup-header">
          <div className="signup-icon">🔐</div>
          <h2>Crear Cuenta</h2>
          <p className="signup-subtitle">Regístrate en CiberEduca</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            ✓ ¡Solicitud enviada! Tu cuenta está pendiente de aprobación por un administrador. Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="username">👤 Nombre de Usuario</label>
            <input
              id="username"
              className="signup-input"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Mínimo 3 caracteres"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="role">🎭 Rol</label>
            <select
              id="role"
              className="signup-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="estudiante">👨‍🎓 Estudiante</option>
              <option value="docente">👨‍🏫 Docente</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="password">🔑 Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                className="signup-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña segura"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {password && (
              <div className="password-requirements">
                <p className="requirements-title">Requisitos de seguridad:</p>
                <div className="requirements-list">
                  <div className={`requirement ${passwordStrength.length ? 'met' : ''}`}>
                    {passwordStrength.length ? '✓' : '✗'} Mínimo 8 caracteres
                  </div>
                  <div className={`requirement ${passwordStrength.uppercase ? 'met' : ''}`}>
                    {passwordStrength.uppercase ? '✓' : '✗'} Una mayúscula (A-Z)
                  </div>
                  <div className={`requirement ${passwordStrength.lowercase ? 'met' : ''}`}>
                    {passwordStrength.lowercase ? '✓' : '✗'} Una minúscula (a-z)
                  </div>
                  <div className={`requirement ${passwordStrength.number ? 'met' : ''}`}>
                    {passwordStrength.number ? '✓' : '✗'} Un número (0-9)
                  </div>
                  <div className={`requirement ${passwordStrength.special ? 'met' : ''}`}>
                    {passwordStrength.special ? '✓' : '✗'} Un carácter especial (!@#$%...)
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">🔁 Confirmar Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                className="signup-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="password-mismatch">⚠️ Las contraseñas no coinciden</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="password-match">✓ Las contraseñas coinciden</p>
            )}
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={!isPasswordValid() || password !== confirmPassword || !user_name}
          >
            → Crear Cuenta
          </button>
        </form>

        <div className="signup-footer">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
}


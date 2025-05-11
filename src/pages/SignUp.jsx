import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Asegúrate de crear este archivo

export default function SignUp() {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('estudiante');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', { user_name, password, role });
      navigate('/login');
    } catch (err) {
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Registrarse</h2>
        <form onSubmit={handleSignUp}>
          <input
            className="signup-input"
            value={user_name}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
          />
          <input
            className="signup-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <select
            className="signup-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="docente">Docente</option>
            <option value="estudiante">Estudiante</option>
          </select>
          <button type="submit" className="signup-button">Entrar</button>
          <p className="forgot-password">¿Olvidaste tu contraseña?</p>
        </form>
      </div>
    </div>
  );
}


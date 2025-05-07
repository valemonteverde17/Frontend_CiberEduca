import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth(); // ✅ Aquí se declara user
  const navigate = useNavigate();

  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) navigate('/topics');
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', { user_name, password });
      login(res.data);
      navigate('/topics');
    } catch (err) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar sesión</h2>
      <input value={user_name} onChange={e => setUserName(e.target.value)} placeholder="Usuario" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Entrar</button>
    </form>
  );
}

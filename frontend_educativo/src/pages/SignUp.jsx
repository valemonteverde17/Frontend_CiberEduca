import { useState,useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';


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
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <input value={user_name} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="docente">Docente</option>
        <option value="estudiante">Estudiante</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

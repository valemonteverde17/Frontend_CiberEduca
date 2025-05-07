import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem', color: '#fff' }}>Inicio</Link>
        {user && <Link to="/topics" style={{ marginRight: '1rem', color: '#fff' }}>Temas</Link>}
        {user && <Link to="/quizzes" style={{ marginRight: '1rem', color: '#fff' }}>Quizzes</Link>}
      </div>
      <div>
        {!user && <>
          <Link to="/login" style={{ marginRight: '1rem', color: '#fff' }}>Iniciar Sesión</Link>
          <Link to="/signup" style={{ color: '#fff' }}>Registrarse</Link>
        </>}
        {user && <>
          <span style={{ marginRight: '1rem' }}>Hola, {user.user_name}</span>
          <button onClick={handleLogout}>Salir</button>
        </>}
      </div>
    </nav>
  );
}

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
    <nav style={{ padding: '1rem', backgroundColor: '#319190', color: '#ffefb5', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem', color: '#ffefb5' }}>Inicio</Link>
        {user && <Link to="/topics" style={{ marginRight: '1rem', color: '#ffefb5' }}>Temas</Link>}
        {user && <Link to="/quizzes" style={{ marginRight: '1rem', color: '#ffefb5' }}>Quizzes</Link>}
      </div>
      <div>
        {!user && <>
          <Link to="/login" style={{ marginRight: '1rem', color: '#ffefb5' }}>Entrar</Link>
          <Link to="/signup" style={{ color: '#ffefb5' }}>Registrarse</Link>
        </>}
        {user && <>
          <span style={{ marginRight: '1rem' }}>Hola, {user.user_name}</span>
          <button onClick={handleLogout}>Salir</button>
        </>}
      </div>
    </nav>
  );
}

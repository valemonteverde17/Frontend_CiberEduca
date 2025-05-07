import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Bienvenido a <span style={{ color: '#0077cc' }}>CiberEduca</span></h1>
      <p>Explora temas clave sobre ciberseguridad y realiza quizzes interactivos.</p>
      {!user && (
        <div style={{ marginTop: '2rem' }}>
          <Link to="/login"><button style={{ marginRight: '1rem' }}>Iniciar sesión</button></Link>
          <Link to="/signup"><button>Registrarse</button></Link>
        </div>
      )}
      {user && (
        <p style={{ marginTop: '2rem' }}>Ya estás autenticado como <strong>{user.user_name}</strong>.</p>
      )}
    </div>
  );
}

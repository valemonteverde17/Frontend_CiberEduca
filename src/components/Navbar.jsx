import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isStudentView, toggleStudentView } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {isStudentView && (
          <div className="student-view-banner">
              Estás viendo la plataforma como Estudiante
              <button onClick={toggleStudentView} className="btn-exit-view">Salir de la vista</button>
          </div>
      )}
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            🔒 CiberEduca
          </Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Inicio</Link>
          {user && user.role === 'admin' && !isStudentView && (
            <Link to="/admin/dashboard" className="nav-link admin-link">⚡ Panel Admin</Link>
          )}
          {user && <Link to="/topics" className="nav-link">Temas</Link>}
          {user && <Link to="/quizzes" className="nav-link">Evaluaciones</Link>}
          {user && <Link to="/games" className="nav-link">Juegos</Link>}
          {user && <Link to="/rankings" className="nav-link">🏆 Rankings</Link>}
        </div>
        
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Entrar</Link>
              <Link to="/signup" className="btn-signup">Registrarse</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="user-greeting">
                {isStudentView ? '👨‍🎓' : (user.role === 'admin' ? '🛡️' : (user.role === 'docente' ? '👨‍🏫' : '👨‍🎓'))} {user.user_name}
              </Link>
              <button onClick={handleLogout} className="btn-logout">Salir</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

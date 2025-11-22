import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, toggleStudentView } = useAuth();
  const navigate = useNavigate();

  const handleViewAsStudent = () => {
      toggleStudentView();
      navigate('/topics');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.user_name}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/admin/users')}>
          <div className="card-icon">👥</div>
          <h3>Gestión de Usuarios</h3>
          <p>Aprobar registros y administrar usuarios.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/content')}>
          <div className="card-icon">📚</div>
          <h3>Gestión de Contenido</h3>
          <p>Revisar temas, quizes y auditoría.</p>
        </div>
        
        <div className="dashboard-card" onClick={handleViewAsStudent}>
            <div className="card-icon">👀</div>
            <h3>Ver como Estudiante</h3>
            <p>Navegar la plataforma como un usuario normal.</p>
        </div>
      </div>
    </div>
  );
}

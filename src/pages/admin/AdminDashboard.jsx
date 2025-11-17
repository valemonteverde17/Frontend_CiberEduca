import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingTopics, setPendingTopics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, topicsRes] = await Promise.all([
        axios.get('/users/pending').catch(() => ({ data: [] })),
        axios.get('/topics/pending-review').catch(() => ({ data: [] }))
      ]);
      
      setPendingUsers(usersRes.data);
      setPendingTopics(topicsRes.data);
      
      // Calcular estadísticas básicas
      setStats({
        pendingUsers: usersRes.data.length,
        pendingTopics: topicsRes.data.length
      });
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    if (!window.confirm('¿Aprobar este usuario?')) return;
    try {
      await axios.post(`/users/approve/${userId}`);
      await loadData();
      alert('✅ Usuario aprobado exitosamente');
    } catch (err) {
      alert('❌ Error al aprobar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('¿Rechazar este usuario?')) return;
    try {
      await axios.post(`/users/reject/${userId}`);
      await loadData();
      alert('✅ Usuario rechazado');
    } catch (err) {
      alert('❌ Error al rechazar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReviewTopic = (topicId) => {
    navigate(`/admin/review-topic/${topicId}`);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Panel de Administración</h1>
        <p className="admin-subtitle">Bienvenido, {user.user_name}</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Usuarios Pendientes</h3>
            <p className="stat-number">{stats?.pendingUsers || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Temas Pendientes</h3>
            <p className="stat-number">{stats?.pendingTopics || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Total Aprobados</h3>
            <p className="stat-number">-</p>
          </div>
        </div>
      </div>

      {/* Usuarios Pendientes */}
      <section className="pending-section">
        <h2>👥 Usuarios Pendientes de Aprobación</h2>
        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            <p>✅ No hay usuarios pendientes de aprobación</p>
          </div>
        ) : (
          <div className="pending-users-list">
            {pendingUsers.map((u) => (
              <div key={u._id} className="pending-user-card">
                <div className="user-info">
                  <h3>{u.user_name}</h3>
                  <span className={`role-badge role-${u.role}`}>
                    {u.role === 'docente' && '👨‍🏫 Docente'}
                    {u.role === 'estudiante' && '👨‍🎓 Estudiante'}
                    {u.role === 'admin' && '👑 Admin'}
                    {u.role === 'revisor' && '👁️ Revisor'}
                  </span>
                  {u.email && <p className="user-email">📧 {u.email}</p>}
                  <p className="user-date">Registrado: {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="user-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApproveUser(u._id)}
                  >
                    ✅ Aprobar
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleRejectUser(u._id)}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Temas Pendientes */}
      <section className="pending-section">
        <h2>📝 Temas Pendientes de Revisión</h2>
        {pendingTopics.length === 0 ? (
          <div className="empty-state">
            <p>✅ No hay temas pendientes de revisión</p>
          </div>
        ) : (
          <div className="pending-topics-list">
            {pendingTopics.map((topic) => (
              <div key={topic._id} className="pending-topic-card">
                <div className="topic-info">
                  <h3>{topic.topic_name}</h3>
                  <p className="topic-description">{topic.description}</p>
                  <div className="topic-meta">
                    <span className="created-by">
                      👤 Creado por: {topic.created_by?.user_name || 'Desconocido'}
                    </span>
                    <span className="created-date">
                      📅 {new Date(topic.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn-review"
                  onClick={() => handleReviewTopic(topic._id)}
                >
                  👁️ Revisar Tema
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Acciones Rápidas */}
      <section className="quick-actions">
        <h2>⚡ Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/admin/users')}>
            👥 Gestionar Usuarios
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/organizations')}>
            🏢 Gestionar Organizaciones
          </button>
          <button className="action-btn" onClick={() => navigate('/topics')}>
            📚 Ver Todos los Temas
          </button>
        </div>
      </section>
    </div>
  );
}

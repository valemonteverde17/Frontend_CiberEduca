import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import StatsCard from '../../components/dashboard/StatsCard';
import UserTable from '../../components/dashboard/UserTable';
import ContentTable from '../../components/dashboard/ContentTable';
import './SuperAdminDashboard.css';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para datos
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    totalTopics: 0,
    totalQuizzes: 0,
    pendingUsers: 0,
    pendingTopics: 0,
    activeUsers: 0
  });
  
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);

  useEffect(() => {
    if (!user?.is_super) {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar todos los datos en paralelo
      const [usersRes, orgsRes, topicsRes, quizzesRes, statsRes] = await Promise.all([
        axios.get('/users'),
        axios.get('/organizations'),
        axios.get('/topics'),
        axios.get('/quiz-sets'),
        axios.get('/approval/stats')
      ]);

      setUsers(usersRes.data);
      setOrganizations(orgsRes.data);
      
      // Filtrar temas pendientes
      const pending = topicsRes.data.filter(t => t.status === 'pending_review');
      setPendingTopics(pending);
      
      // Filtrar quizzes pendientes
      const pendingQ = quizzesRes.data.filter(q => q.status === 'pending_review');
      setPendingQuizzes(pendingQ);

      // Calcular estadísticas
      setStats({
        totalUsers: usersRes.data.length,
        totalOrganizations: orgsRes.data.length,
        totalTopics: topicsRes.data.length,
        totalQuizzes: quizzesRes.data.length,
        pendingUsers: usersRes.data.filter(u => u.status === 'pending').length,
        pendingTopics: pending.length,
        activeUsers: usersRes.data.filter(u => u.status === 'active').length,
        ...statsRes.data
      });
    } catch (err) {
      console.error('Error cargando datos:', err);
      alert('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    if (!window.confirm('¿Aprobar este usuario?')) return;
    try {
      await axios.post(`/users/${userId}/approve`);
      await loadData();
      alert('✅ Usuario aprobado exitosamente');
    } catch (err) {
      alert('❌ Error al aprobar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('¿Rechazar este usuario?')) return;
    try {
      await axios.post(`/users/${userId}/reject`);
      await loadData();
      alert('Usuario rechazado');
    } catch (err) {
      alert('Error al rechazar usuario');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm('¿Suspender este usuario?')) return;
    try {
      await axios.post(`/users/${userId}/suspend`);
      await loadData();
      alert('Usuario suspendido');
    } catch (err) {
      alert('Error al suspender usuario');
    }
  };

  const handleActivateUser = async (userId) => {
    if (!window.confirm('¿Activar este usuario?')) return;
    try {
      await axios.post(`/users/${userId}/activate`);
      await loadData();
      alert('✅ Usuario activado');
    } catch (err) {
      alert('Error al activar usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ ¿ELIMINAR este usuario permanentemente? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/users/${userId}`);
      await loadData();
      alert('Usuario eliminado');
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  const handleApproveTopic = async (topicId) => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/approve`);
      await loadData();
      alert('✅ Tema aprobado');
    } catch (err) {
      alert('Error al aprobar tema');
    }
  };

  const handleRejectTopic = async (topicId) => {
    const comments = prompt('Comentarios de rechazo (opcional):');
    try {
      await axios.post(`/topics/${topicId}/reject`, { comments });
      await loadData();
      alert('Tema rechazado');
    } catch (err) {
      alert('Error al rechazar tema');
    }
  };

  if (loading) {
    return (
      <div className="super-admin-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="super-admin-dashboard">
      <div className="super-admin-header">
        <div>
          <h1>👑 Super Admin Dashboard</h1>
          <p>Acceso total al sistema - Vista global</p>
        </div>
        <button className="btn-refresh" onClick={loadData}>
          🔄 Actualizar
        </button>
      </div>

      {/* Tabs de navegación */}
      <div className="super-admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Resumen
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizations')}
        >
          🏢 Organizaciones ({organizations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📚 Contenido
        </button>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pendientes ({stats.pendingUsers + stats.pendingTopics})
        </button>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'overview' && (
        <div className="super-admin-content">
          <div className="stats-grid">
            <StatsCard
              icon="👥"
              title="Total Usuarios"
              value={stats.totalUsers}
              subtitle={`${stats.activeUsers} activos`}
              color="blue"
            />
            <StatsCard
              icon="🏢"
              title="Organizaciones"
              value={stats.totalOrganizations}
              color="purple"
            />
            <StatsCard
              icon="📚"
              title="Temas"
              value={stats.totalTopics}
              subtitle={`${stats.pendingTopics} pendientes`}
              color="teal"
            />
            <StatsCard
              icon="📋"
              title="Quizzes"
              value={stats.totalQuizzes}
              color="green"
            />
            <StatsCard
              icon="⏳"
              title="Usuarios Pendientes"
              value={stats.pendingUsers}
              color="orange"
            />
            <StatsCard
              icon="✅"
              title="Aprobaciones Hoy"
              value={stats.approvedToday || 0}
              color="green"
            />
          </div>

          {/* Actividad reciente */}
          <div className="super-admin-section">
            <h2>📋 Actividad Reciente</h2>
            <div className="activity-grid">
              <div className="activity-card">
                <h3>Últimos Usuarios Registrados</h3>
                <ul className="activity-list">
                  {users.slice(0, 5).map(u => (
                    <li key={u._id}>
                      <span className="activity-icon">👤</span>
                      <span>{u.user_name}</span>
                      <span className={`activity-status status-${u.status}`}>
                        {u.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="activity-card">
                <h3>Últimos Temas Creados</h3>
                <ul className="activity-list">
                  {pendingTopics.slice(0, 5).map(t => (
                    <li key={t._id}>
                      <span className="activity-icon">📚</span>
                      <span>{t.topic_name}</span>
                      <span className="activity-author">
                        por {t.created_by?.user_name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="super-admin-content">
          <div className="super-admin-section">
            <h2>👥 Gestión de Usuarios</h2>
            <UserTable
              users={users}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              onSuspend={handleSuspendUser}
              onActivate={handleActivateUser}
              onDelete={handleDeleteUser}
              showActions={true}
              canManage={true}
            />
          </div>
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="super-admin-content">
          <div className="super-admin-section">
            <h2>🏢 Organizaciones</h2>
            <div className="organizations-grid">
              {organizations.map(org => (
                <div key={org._id} className="organization-card">
                  <div className="org-header">
                    <h3>{org.name}</h3>
                    <span className="org-code">{org.code}</span>
                  </div>
                  <div className="org-stats">
                    <div className="org-stat">
                      <span className="org-stat-label">Admin:</span>
                      <span className="org-stat-value">
                        {org.admin_id?.user_name || 'Sin asignar'}
                      </span>
                    </div>
                    <div className="org-stat">
                      <span className="org-stat-label">Usuarios:</span>
                      <span className="org-stat-value">
                        {users.filter(u => u.organization_id?._id === org._id).length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="super-admin-content">
          <div className="super-admin-section">
            <h2>📚 Contenido del Sistema</h2>
            <div className="content-stats">
              <div className="content-stat-card">
                <h3>Temas por Estado</h3>
                <div className="stat-breakdown">
                  <div className="stat-item">
                    <span>✅ Aprobados:</span>
                    <strong>{stats.approvedTopics || 0}</strong>
                  </div>
                  <div className="stat-item">
                    <span>⏳ En Revisión:</span>
                    <strong>{stats.pendingTopics}</strong>
                  </div>
                  <div className="stat-item">
                    <span>📝 Borradores:</span>
                    <strong>{stats.draftTopics || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="super-admin-content">
          <div className="super-admin-section">
            <h2>⏳ Aprobaciones Pendientes</h2>
            
            <h3>Usuarios Pendientes</h3>
            <UserTable
              users={users.filter(u => u.status === 'pending')}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              onSuspend={handleSuspendUser}
              onActivate={handleActivateUser}
              onDelete={handleDeleteUser}
              showActions={true}
              canManage={true}
            />

            <h3 style={{ marginTop: '2rem' }}>Temas Pendientes</h3>
            <ContentTable
              items={pendingTopics}
              type="topics"
              onApprove={handleApproveTopic}
              onReject={handleRejectTopic}
              canReview={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

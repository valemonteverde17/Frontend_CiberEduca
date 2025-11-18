import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import ContentTable from '../../components/dashboard/ContentTable';
import './RevisorDashboard.css';

export default function RevisorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  
  // Estados para datos
  const [stats, setStats] = useState({
    pendingTopics: 0,
    pendingQuizzes: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalReviewed: 0,
    myOrgTopics: 0
  });
  
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar datos según organización del revisor
      const [topicsRes, quizzesRes, statsRes] = await Promise.all([
        axios.get('/topics'),
        axios.get('/quiz-sets').catch(() => ({ data: [] })),
        axios.get('/approval/stats').catch(() => ({ data: {} }))
      ]);

      // Filtrar por organización si el revisor tiene una
      const orgTopics = user.organization_id
        ? topicsRes.data.filter(t => t.organization_id?._id === user.organization_id)
        : topicsRes.data;
      
      const orgQuizzes = user.organization_id
        ? quizzesRes.data.filter(q => q.organization_id?._id === user.organization_id)
        : quizzesRes.data;
      
      setAllTopics(orgTopics);
      setAllQuizzes(orgQuizzes);
      
      // Filtrar pendientes
      const pendingT = orgTopics.filter(t => t.status === 'pending_review');
      const pendingQ = orgQuizzes.filter(q => q.status === 'pending_review');
      
      setPendingTopics(pendingT);
      setPendingQuizzes(pendingQ);

      // Actividad reciente (últimos 10 items revisados)
      const reviewed = orgTopics
        .filter(t => t.reviewed_by?._id === user._id)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 10);
      
      setRecentActivity(reviewed);

      // Calcular estadísticas
      setStats({
        pendingTopics: pendingT.length,
        pendingQuizzes: pendingQ.length,
        approvedToday: statsRes.data.approvedToday || 0,
        rejectedToday: statsRes.data.rejectedToday || 0,
        totalReviewed: reviewed.length,
        myOrgTopics: orgTopics.length
      });
    } catch (err) {
      console.error('Error al cargar datos:', err);
      alert('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTopic = async (topicId) => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/approve`);
      await loadData();
      alert('✅ Tema aprobado exitosamente');
    } catch (err) {
      alert('Error al aprobar tema: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectTopic = async (topicId) => {
    const comments = prompt('Comentarios de rechazo (requerido):');
    if (!comments) {
      alert('Debes proporcionar comentarios para rechazar un tema');
      return;
    }
    try {
      await axios.post(`/topics/${topicId}/reject`, { comments });
      await loadData();
      alert('Tema rechazado con comentarios');
    } catch (err) {
      alert('Error al rechazar tema');
    }
  };

  const handleApproveQuiz = async (quizId) => {
    if (!window.confirm('¿Aprobar este quiz?')) return;
    try {
      await axios.post(`/quiz-sets/${quizId}/approve`);
      await loadData();
      alert('✅ Quiz aprobado exitosamente');
    } catch (err) {
      alert('Error al aprobar quiz');
    }
  };

  const handleRejectQuiz = async (quizId) => {
    const comments = prompt('Comentarios de rechazo (requerido):');
    if (!comments) {
      alert('Debes proporcionar comentarios para rechazar un quiz');
      return;
    }
    try {
      await axios.post(`/quiz-sets/${quizId}/reject`, { comments });
      await loadData();
      alert('Quiz rechazado con comentarios');
    } catch (err) {
      alert('Error al rechazar quiz');
    }
  };

  if (loading) {
    return (
      <div className="revisor-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="revisor-dashboard">
      <div className="revisor-header">
        <div>
          <h1>👁️ Revisor Dashboard</h1>
          <p>Bienvenido, {user.user_name} - {user.organization_id?.name || 'Revisor General'}</p>
        </div>
        <button className="btn-refresh" onClick={loadData}>
          🔄 Actualizar
        </button>
      </div>

      {/* Tabs de navegación */}
      <div className="revisor-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pendientes ({stats.pendingTopics + stats.pendingQuizzes})
        </button>
        <button
          className={`tab-btn ${activeTab === 'all-topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('all-topics')}
        >
          📚 Todos los Temas ({allTopics.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'all-quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('all-quizzes')}
        >
          📋 Todos los Quizzes ({allQuizzes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Estadísticas
        </button>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'pending' && (
        <div className="revisor-content">
          <div className="stats-grid">
            <StatsCard
              icon="⏳"
              title="Temas Pendientes"
              value={stats.pendingTopics}
              color="orange"
            />
            <StatsCard
              icon="📋"
              title="Quizzes Pendientes"
              value={stats.pendingQuizzes}
              color="purple"
            />
            <StatsCard
              icon="✅"
              title="Aprobados Hoy"
              value={stats.approvedToday}
              color="green"
            />
            <StatsCard
              icon="❌"
              title="Rechazados Hoy"
              value={stats.rejectedToday}
              color="red"
            />
          </div>

          <div className="revisor-section">
            <h2>📚 Temas Pendientes de Revisión</h2>
            {pendingTopics.length === 0 ? (
              <div className="empty-state">
                <p>✅ No hay temas pendientes de revisión</p>
              </div>
            ) : (
              <ContentTable
                items={pendingTopics}
                type="topics"
                onApprove={handleApproveTopic}
                onReject={handleRejectTopic}
                canReview={true}
              />
            )}
          </div>

          <div className="revisor-section">
            <h2>📋 Quizzes Pendientes de Revisión</h2>
            {pendingQuizzes.length === 0 ? (
              <div className="empty-state">
                <p>✅ No hay quizzes pendientes de revisión</p>
              </div>
            ) : (
              <ContentTable
                items={pendingQuizzes}
                type="quizzes"
                onApprove={handleApproveQuiz}
                onReject={handleRejectQuiz}
                canReview={true}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'all-topics' && (
        <div className="revisor-content">
          <div className="revisor-section">
            <h2>📚 Todos los Temas de mi Organización</h2>
            <ContentTable
              items={allTopics}
              type="topics"
              onApprove={handleApproveTopic}
              onReject={handleRejectTopic}
              canReview={true}
            />
          </div>
        </div>
      )}

      {activeTab === 'all-quizzes' && (
        <div className="revisor-content">
          <div className="revisor-section">
            <h2>📋 Todos los Quizzes de mi Organización</h2>
            <ContentTable
              items={allQuizzes}
              type="quizzes"
              onApprove={handleApproveQuiz}
              onReject={handleRejectQuiz}
              canReview={true}
            />
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="revisor-content">
          <div className="stats-grid">
            <StatsCard
              icon="📚"
              title="Total Temas"
              value={allTopics.length}
              subtitle={`${stats.pendingTopics} pendientes`}
              color="teal"
            />
            <StatsCard
              icon="📋"
              title="Total Quizzes"
              value={allQuizzes.length}
              subtitle={`${stats.pendingQuizzes} pendientes`}
              color="purple"
            />
            <StatsCard
              icon="✅"
              title="Aprobados"
              value={allTopics.filter(t => t.status === 'approved').length}
              color="green"
            />
            <StatsCard
              icon="❌"
              title="Rechazados"
              value={allTopics.filter(t => t.status === 'rejected').length}
              color="red"
            />
          </div>

          <div className="revisor-section">
            <h2>📋 Mi Actividad Reciente</h2>
            <div className="activity-timeline">
              {recentActivity.length === 0 ? (
                <div className="empty-state">
                  <p>No has revisado ningún contenido aún</p>
                </div>
              ) : (
                <div className="timeline-list">
                  {recentActivity.map(item => (
                    <div key={item._id} className="timeline-item">
                      <div className="timeline-marker">
                        {item.status === 'approved' ? '✅' : '❌'}
                      </div>
                      <div className="timeline-content">
                        <h4>{item.topic_name}</h4>
                        <p className="timeline-meta">
                          <span className={`timeline-status status-${item.status}`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </span>
                          <span className="timeline-date">
                            {new Date(item.updatedAt).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </p>
                        {item.review_comments && (
                          <p className="timeline-comments">
                            💬 {item.review_comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="revisor-section">
            <h2>📊 Distribución de Estados</h2>
            <div className="status-distribution">
              <div className="status-bar">
                <div className="status-segment approved" style={{
                  width: `${(allTopics.filter(t => t.status === 'approved').length / allTopics.length * 100) || 0}%`
                }}>
                  <span>Aprobados</span>
                </div>
                <div className="status-segment pending" style={{
                  width: `${(allTopics.filter(t => t.status === 'pending_review').length / allTopics.length * 100) || 0}%`
                }}>
                  <span>Pendientes</span>
                </div>
                <div className="status-segment rejected" style={{
                  width: `${(allTopics.filter(t => t.status === 'rejected').length / allTopics.length * 100) || 0}%`
                }}>
                  <span>Rechazados</span>
                </div>
                <div className="status-segment draft" style={{
                  width: `${(allTopics.filter(t => t.status === 'draft').length / allTopics.length * 100) || 0}%`
                }}>
                  <span>Borradores</span>
                </div>
              </div>
              <div className="status-legend">
                <div className="legend-item">
                  <span className="legend-color approved"></span>
                  <span>Aprobados: {allTopics.filter(t => t.status === 'approved').length}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color pending"></span>
                  <span>Pendientes: {allTopics.filter(t => t.status === 'pending_review').length}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color rejected"></span>
                  <span>Rechazados: {allTopics.filter(t => t.status === 'rejected').length}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color draft"></span>
                  <span>Borradores: {allTopics.filter(t => t.status === 'draft').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TopicCard from '../components/topics/TopicCard';
import StatsCard from '../components/dashboard/StatsCard';
import './MyTopics.css';

export default function MyTopics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMyTopics();
  }, []);

  const loadMyTopics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/topics/my-topics');
      setTopics(res.data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
      alert('Error al cargar tus temas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm('⚠️ ¿ELIMINAR este tema permanentemente?')) return;
    try {
      await axios.delete(`/topics/${topicId}`);
      await loadMyTopics();
      alert('✅ Tema eliminado');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitReview = async (topicId) => {
    if (!window.confirm('¿Enviar este tema a revisión?')) return;
    try {
      await axios.post(`/topics/${topicId}/submit-review`);
      await loadMyTopics();
      alert('✅ Tema enviado a revisión');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (topic) => {
    navigate(`/topics/${topic._id}`);
  };

  const handleApprove = async (topicId) => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/approve`);
      await loadMyTopics();
      alert('✅ Tema aprobado');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (topicId) => {
    const comments = prompt('Comentarios de rechazo (requerido):');
    if (!comments) {
      alert('Debes proporcionar comentarios');
      return;
    }
    try {
      await axios.post(`/topics/${topicId}/reject`, { comments });
      await loadMyTopics();
      alert('Tema rechazado');
    } catch (err) {
      alert('Error al rechazar tema');
    }
  };

  const handleArchive = async (topicId) => {
    if (!window.confirm('¿Archivar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/archive`);
      await loadMyTopics();
      alert('✅ Tema archivado');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredTopics = topics.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.topic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: topics.length,
    draft: topics.filter(t => t.status === 'draft').length,
    pending: topics.filter(t => t.status === 'pending_review').length,
    approved: topics.filter(t => t.status === 'approved').length,
    rejected: topics.filter(t => t.status === 'rejected').length,
    archived: topics.filter(t => t.status === 'archived').length,
  };

  if (loading) {
    return (
      <div className="my-topics-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tus temas...</p>
      </div>
    );
  }

  return (
    <div className="my-topics-page">
      <div className="page-header">
        <h1>📚 Mis Temas</h1>
        <button className="btn-create-topic" onClick={() => navigate('/topics/create')}>
          ➕ Crear Nuevo Tema
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <StatsCard
          icon="📚"
          title="Total Temas"
          value={stats.total}
          color="blue"
        />
        <StatsCard
          icon="📝"
          title="Borradores"
          value={stats.draft}
          color="gray"
        />
        <StatsCard
          icon="⏳"
          title="En Revisión"
          value={stats.pending}
          color="orange"
        />
        <StatsCard
          icon="✅"
          title="Aprobados"
          value={stats.approved}
          color="green"
        />
        <StatsCard
          icon="❌"
          title="Rechazados"
          value={stats.rejected}
          color="red"
        />
        <StatsCard
          icon="📦"
          title="Archivados"
          value={stats.archived}
          color="gray"
        />
      </div>

      {/* Búsqueda y Filtros */}
      <div className="search-filter-section">
        <input
          type="text"
          placeholder="🔍 Buscar en mis temas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-section">
        <label>Filtrar por estado:</label>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todos ({stats.total})
          </button>
          <button 
            className={filter === 'draft' ? 'active' : ''} 
            onClick={() => setFilter('draft')}
          >
            📝 Borradores ({stats.draft})
          </button>
          <button 
            className={filter === 'pending_review' ? 'active' : ''} 
            onClick={() => setFilter('pending_review')}
          >
            ⏳ En Revisión ({stats.pending})
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''} 
            onClick={() => setFilter('approved')}
          >
            ✅ Aprobados ({stats.approved})
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            ❌ Rechazados ({stats.rejected})
          </button>
          <button 
            className={filter === 'archived' ? 'active' : ''} 
            onClick={() => setFilter('archived')}
          >
            📦 Archivados ({stats.archived})
          </button>
        </div>
      </div>

      {/* Grid de Temas */}
      {filteredTopics.length === 0 ? (
        <div className="empty-state">
          <p>📭 No se encontraron temas</p>
          {filter === 'all' && searchTerm === '' && (
            <button className="btn-create-first" onClick={() => navigate('/topics')}>
              Crear Primer Tema
            </button>
          )}
        </div>
      ) : (
        <div className="topics-grid-modern">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSubmitReview={handleSubmitReview}
              onApprove={handleApprove}
              onReject={handleReject}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

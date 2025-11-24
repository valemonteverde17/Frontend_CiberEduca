import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import TopicStatusBadge from '../../components/TopicStatusBadge';
import './ContentManagement.css';

export default function ContentManagement() {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState('all'); // 'all' | 'pending' | 'edit-requests' | 'trash'
  const [filterStatus, setFilterStatus] = useState('all'); // Para filtrar por estado en vista 'all'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopics();
  }, [view]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      let endpoint = '/topics?all=true';
      if (view === 'trash') endpoint = '/topics/trash';
      if (view === 'pending') endpoint = '/topics/status/pending_approval';
      if (view === 'edit-requests') endpoint = '/topics/edit-requests';
      
      const res = await axios.get(endpoint);
      let filteredTopics = res.data;
      
      // Filtrar por estado si estamos en vista 'all'
      if (view === 'all' && filterStatus !== 'all') {
        filteredTopics = res.data.filter(t => t.status === filterStatus);
      }
      
      setTopics(filteredTopics);
    } catch (err) {
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm('¿Estás seguro de restaurar este tema?')) return;
    try {
      await axios.patch(`/topics/${id}/restore`);
      loadTopics();
    } catch (err) {
      console.error('Error restoring topic:', err);
      alert('Error al restaurar tema');
    }
  };

  const handleApproveTopic = async (id) => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.patch(`/topics/${id}/approve-topic`);
      loadTopics();
      alert('✅ Tema aprobado exitosamente');
    } catch (err) {
      console.error('Error approving topic:', err);
      alert('❌ Error al aprobar tema: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectTopic = async (id) => {
    const reason = prompt('Razón del rechazo (opcional):');
    if (reason === null) return; // Cancelado
    try {
      await axios.patch(`/topics/${id}/reject-topic`, { reason });
      loadTopics();
      alert('✅ Tema rechazado');
    } catch (err) {
      console.error('Error rejecting topic:', err);
      alert('❌ Error al rechazar tema');
    }
  };

  const handleApproveEditRequest = async (id) => {
    if (!window.confirm('¿Aprobar solicitud de edición?')) return;
    try {
      await axios.patch(`/topics/${id}/approve-edit-request`);
      loadTopics();
      alert('✅ Solicitud aprobada. El tema ahora está en modo edición.');
    } catch (err) {
      console.error('Error approving edit request:', err);
      alert('❌ Error al aprobar solicitud');
    }
  };

  const handleRejectEditRequest = async (id) => {
    if (!window.confirm('¿Rechazar solicitud de edición?')) return;
    try {
      await axios.patch(`/topics/${id}/reject-edit-request`);
      loadTopics();
      alert('✅ Solicitud rechazada');
    } catch (err) {
      console.error('Error rejecting edit request:', err);
      alert('❌ Error al rechazar solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este tema?')) return;
    try {
      await axios.delete(`/topics/${id}`);
      loadTopics();
    } catch (err) {
      console.error('Error deleting topic:', err);
      alert('Error al eliminar tema');
    }
  };

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      await axios.patch(`/topics/${topicId}`, { status: newStatus });
      loadTopics();
      alert(`✅ Estado actualizado a: ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('❌ Error al actualizar estado');
    }
  };

  const renderActions = (topic) => {
    if (view === 'trash') {
      return (
        <>
          <button className="btn-action btn-restore" onClick={() => handleRestore(topic._id)}>
            ↩️ Restaurar
          </button>
        </>
      );
    }

    if (view === 'pending') {
      return (
        <>
          <button className="btn-action btn-approve" onClick={() => handleApproveTopic(topic._id)}>
            ✅ Aprobar
          </button>
          <button className="btn-action btn-reject" onClick={() => handleRejectTopic(topic._id)}>
            ❌ Rechazar
          </button>
          <button className="btn-action btn-view" onClick={() => navigate(`/topics/${topic._id}`)}>
            👁️ Ver
          </button>
        </>
      );
    }

    if (view === 'edit-requests') {
      return (
        <>
          <button className="btn-action btn-approve" onClick={() => handleApproveEditRequest(topic._id)}>
            ✅ Aprobar Edición
          </button>
          <button className="btn-action btn-reject" onClick={() => handleRejectEditRequest(topic._id)}>
            ❌ Rechazar
          </button>
          <button className="btn-action btn-view" onClick={() => navigate(`/topics/${topic._id}`)}>
            👁️ Ver
          </button>
        </>
      );
    }

    // Vista 'all' - acciones según estado
    return (
      <>
        <button className="btn-action btn-view" onClick={() => navigate(`/topics/${topic._id}`)}>
          👁️ Ver
        </button>
        <button className="btn-action btn-delete" onClick={() => handleDelete(topic._id)}>
          🗑️ Eliminar
        </button>
      </>
    );
  };

  return (
    <div className="content-management-page">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Panel
      </button>

      <div className="header">
        <h1>Gestión de Contenido</h1>
        <div className="view-selector">
          <button 
            className={view === 'all' ? 'active' : ''} 
            onClick={() => setView('all')}
          >
            📋 Todos
          </button>
          <button 
            className={view === 'pending' ? 'active' : ''} 
            onClick={() => setView('pending')}
          >
            ⏳ Pendientes
          </button>
          <button 
            className={view === 'edit-requests' ? 'active' : ''} 
            onClick={() => setView('edit-requests')}
          >
            ✏️ Solicitudes de Edición
          </button>
          <button 
            className={view === 'trash' ? 'active' : ''} 
            onClick={() => setView('trash')}
          >
            🗑️ Papelera
          </button>
        </div>
      </div>

      {view === 'all' && (
        <div className="filter-section">
          <label>Filtrar por estado:</label>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); loadTopics(); }}>
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="pending_approval">Pendiente de Aprobación</option>
            <option value="approved">Aprobado</option>
            <option value="editing">En Edición</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : topics.length === 0 ? (
        <div className="empty-state">
          <p>📭 No hay temas en esta vista</p>
        </div>
      ) : (
        <table className="content-table">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Creado Por</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={topic._id}>
                <td className="topic-name-cell">
                  <a 
                    href={`/topics/${topic._id}`} 
                    className="topic-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/topics/${topic._id}`);
                    }}
                  >
                    {topic.topic_name}
                  </a>
                </td>
                <td>{topic.created_by?.user_name || 'Desconocido'}</td>
                <td>
                  {view === 'all' ? (
                    <select 
                      className="status-selector"
                      value={topic.status || 'draft'}
                      onChange={(e) => handleStatusChange(topic._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="draft">📝 Borrador</option>
                      <option value="pending_approval">⏳ Pendiente</option>
                      <option value="approved">✅ Aprobado</option>
                      <option value="editing">✏️ En Edición</option>
                      <option value="rejected">❌ Rechazado</option>
                    </select>
                  ) : (
                    <TopicStatusBadge status={topic.status || 'draft'} />
                  )}
                  {topic.edit_request_pending && (
                    <span className="edit-request-indicator" title="Solicitud de edición pendiente">⏳</span>
                  )}
                </td>
                <td>
                  {view === 'trash' 
                    ? new Date(topic.deleted_at).toLocaleDateString()
                    : new Date(topic.createdAt).toLocaleDateString()
                    }
                </td>
                <td className="actions-cell">
                  {renderActions(topic)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

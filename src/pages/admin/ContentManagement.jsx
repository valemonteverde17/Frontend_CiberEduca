import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './ContentManagement.css';

export default function ContentManagement() {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState('active'); // 'active' | 'trash' | 'pending'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopics();
  }, [view]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      let endpoint = '/topics';
      if (view === 'trash') endpoint = '/topics/trash';
      if (view === 'pending') endpoint = '/topics/pending';
      
      const res = await axios.get(endpoint);
      setTopics(res.data);
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

  const handleApprove = async (id) => {
      try {
          await axios.patch(`/topics/${id}/approve`);
          loadTopics();
          alert('Tema aprobado exitosamente');
      } catch (err) {
          console.error('Error approving topic:', err);
          alert('Error al aprobar tema');
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

  return (
    <div className="content-management-page">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Panel
      </button>

      <div className="header">
        <h1>Gestión de Contenido</h1>
        <div className="view-selector">
            <button 
                className={view === 'active' ? 'active' : ''} 
                onClick={() => setView('active')}
            >
                Activos
            </button>
            <button 
                className={view === 'pending' ? 'active' : ''} 
                onClick={() => setView('pending')}
            >
                Pendientes ⏳
            </button>
            <button 
                className={view === 'trash' ? 'active' : ''} 
                onClick={() => setView('trash')}
            >
                Papelera 🗑️
            </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="content-table">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Creado Por</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={topic._id}>
                <td>{topic.topic_name}</td>
                <td>{topic.created_by?.user_name || 'Desconocido'}</td>
                <td>
                    {view === 'trash' 
                        ? `Eliminado: ${new Date(topic.deleted_at).toLocaleDateString()}`
                        : `Creado: ${new Date(topic.createdAt).toLocaleDateString()}`
                    }
                </td>
                <td>
                    {view === 'trash' && <span className="badge deleted">Eliminado</span>}
                    {view === 'pending' && <span className="badge pending">Pendiente</span>}
                    {view === 'active' && <span className="badge active">Activo</span>}
                </td>
                <td>
                  {view === 'trash' && (
                    <button className="btn-restore" onClick={() => handleRestore(topic._id)}>
                      ♻️ Restaurar
                    </button>
                  )}
                  {view === 'pending' && (
                      <button className="btn-approve" onClick={() => handleApprove(topic._id)}>
                          ✓ Aprobar
                      </button>
                  )}
                  {view === 'active' && (
                    <button className="btn-delete" onClick={() => handleDelete(topic._id)}>
                      🗑️ Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
                <tr>
                    <td colSpan="5" style={{textAlign: 'center'}}>No hay temas en esta vista.</td>
                </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

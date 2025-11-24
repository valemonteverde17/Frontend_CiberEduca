import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './CollaboratorManager.css';

export default function CollaboratorManager({ topicId, currentCollaborators, onUpdate }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (showAddModal) {
      fetchUsers();
    }
  }, [showAddModal]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users');
      // Filtrar solo docentes que no sean colaboradores actuales
      const teachers = res.data.filter(u => 
        u.role === 'docente' && 
        !currentCollaborators.some(c => (c._id || c) === u._id)
      );
      setUsers(teachers);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (userId) => {
    try {
      await axios.post(`/topics/${topicId}/collaborators`, { collaboratorId: userId });
      alert('✅ Colaborador agregado exitosamente');
      setShowAddModal(false);
      onUpdate();
    } catch (err) {
      alert('❌ Error al agregar colaborador: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (!window.confirm('¿Eliminar este colaborador?')) return;
    try {
      await axios.delete(`/topics/${topicId}/collaborators/${userId}`);
      alert('✅ Colaborador eliminado');
      onUpdate();
    } catch (err) {
      alert('❌ Error al eliminar colaborador');
    }
  };

  const filteredUsers = users.filter(u => 
    u.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="collaborator-manager">
      <div className="collaborator-header">
        <h4>👥 Colaboradores ({currentCollaborators.length})</h4>
        <button className="btn-add-collab" onClick={() => setShowAddModal(true)}>
          + Agregar
        </button>
      </div>

      {currentCollaborators.length > 0 ? (
        <div className="collaborator-list">
          {currentCollaborators.map(collab => (
            <div key={collab._id || collab} className="collaborator-item">
              <span className="collab-name">
                👤 {collab.user_name || 'Usuario'}
              </span>
              <button 
                className="btn-remove-collab"
                onClick={() => handleRemoveCollaborator(collab._id || collab)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-collaborators">No hay colaboradores aún</p>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content-collab" onClick={(e) => e.stopPropagation()}>
            <h3>Agregar Colaborador</h3>
            <input
              type="text"
              className="search-collab"
              placeholder="🔍 Buscar docente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
              <p className="loading-text">Cargando...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="no-users">No hay docentes disponibles</p>
            ) : (
              <div className="users-list">
                {filteredUsers.map(user => (
                  <div key={user._id} className="user-item">
                    <span>{user.user_name}</span>
                    <button 
                      className="btn-add-user"
                      onClick={() => handleAddCollaborator(user._id)}
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-close-modal" onClick={() => setShowAddModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

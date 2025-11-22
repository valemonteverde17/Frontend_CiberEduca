import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('all'); // 'all' | 'pending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    role: 'estudiante',
    status: 'active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [view]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'pending' ? '/users/pending' : '/users';
      const res = await axios.get(endpoint);
      setUsers(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.patch(`/users/${userId}/status`, { status });
      fetchUsers();
      alert(`✅ Usuario ${status === 'active' ? 'aprobado' : 'rechazado'} exitosamente.`);
    } catch (err) {
      console.error(err);
      alert('❌ Error al actualizar estado.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.user_name || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }
    try {
      await axios.post('/users', formData);
      setShowCreateModal(false);
      setFormData({ user_name: '', password: '', role: 'estudiante', status: 'active' });
      fetchUsers();
      alert('✅ Usuario creado exitosamente');
    } catch (err) {
      console.error(err);
      alert('❌ Error al crear usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!formData.user_name) {
      alert('El nombre de usuario es requerido');
      return;
    }
    try {
      const updateData = { 
        user_name: formData.user_name, 
        role: formData.role,
        status: formData.status 
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await axios.patch(`/users/${selectedUser._id}`, updateData);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ user_name: '', password: '', role: 'estudiante', status: 'active' });
      fetchUsers();
      alert('✅ Usuario actualizado exitosamente');
    } catch (err) {
      console.error(err);
      alert('❌ Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/users/${userId}`);
      fetchUsers();
      alert('✅ Usuario eliminado exitosamente');
    } catch (err) {
      console.error(err);
      alert('❌ Error al eliminar usuario');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      user_name: user.user_name,
      password: '',
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  return (
    <div className="user-management-page">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Panel
      </button>
      
      <div className="header">
        <h1>Gestión de Usuarios</h1>
        <div className="header-actions">
          <div className="view-selector">
            <button 
              className={view === 'all' ? 'active' : ''} 
              onClick={() => setView('all')}
            >
              👥 Todos
            </button>
            <button 
              className={view === 'pending' ? 'active' : ''} 
              onClick={() => setView('pending')}
            >
              ⏳ Pendientes
            </button>
          </div>
          <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
            + Crear Usuario
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>📭 No hay usuarios en esta vista</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="user-name-cell">{user.user_name}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'docente' ? '👨‍🏫 Docente' : '👨‍🎓 Estudiante'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '✅ Activo' : user.status === 'pending' ? '⏳ Pendiente' : '❌ Rechazado'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {view === 'pending' ? (
                      <>
                        <button 
                          className="btn-action btn-approve"
                          onClick={() => handleStatusChange(user._id, 'active')}
                        >
                          ✓ Aprobar
                        </button>
                        <button 
                          className="btn-action btn-reject"
                          onClick={() => handleStatusChange(user._id, 'rejected')}
                        >
                          ✗ Rechazar
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(user)}
                        >
                          ✏️ Editar
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Crear Nuevo Usuario</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Activo</option>
                  <option value="pending">Pendiente</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Usuario</h3>
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">✅ Activo</option>
                  <option value="pending">⏳ Pendiente</option>
                  <option value="rejected">❌ Rechazado</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

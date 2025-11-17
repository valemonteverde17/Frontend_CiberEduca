import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './UserManagement.css';

export default function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, admin, revisor, docente, estudiante
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, pending, suspended, rejected
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    user_name: '',
    password: '',
    email: '',
    role: 'estudiante',
    organization_id: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, orgsRes] = await Promise.all([
        axios.get('/users'),
        axios.get('/organizations').catch(() => ({ data: [] }))
      ]);
      setUsers(usersRes.data);
      setOrganizations(orgsRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', newUser);
      await loadData();
      setShowCreateModal(false);
      setNewUser({
        user_name: '',
        password: '',
        email: '',
        role: 'estudiante',
        organization_id: '',
        status: 'active'
      });
      alert('✅ Usuario creado exitosamente');
    } catch (err) {
      alert('❌ Error al crear usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('¿Aprobar este usuario?')) return;
    try {
      await axios.post(`/users/approve/${userId}`);
      await loadData();
      alert('✅ Usuario aprobado');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('¿Rechazar este usuario?')) return;
    try {
      await axios.post(`/users/reject/${userId}`);
      await loadData();
      alert('✅ Usuario rechazado');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSuspend = async (userId) => {
    if (!window.confirm('¿Suspender este usuario?')) return;
    try {
      await axios.post(`/users/suspend/${userId}`);
      await loadData();
      alert('✅ Usuario suspendido');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleActivate = async (userId) => {
    if (!window.confirm('¿Activar este usuario?')) return;
    try {
      await axios.post(`/users/activate/${userId}`);
      await loadData();
      alert('✅ Usuario activado');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('⚠️ ¿ELIMINAR este usuario permanentemente? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/users/${userId}`);
      await loadData();
      alert('✅ Usuario eliminado');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter(u => {
    const roleMatch = filter === 'all' || u.role === filter;
    const statusMatch = statusFilter === 'all' || u.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    revisores: users.filter(u => u.role === 'revisor').length,
    docentes: users.filter(u => u.role === 'docente').length,
    estudiantes: users.filter(u => u.role === 'estudiante').length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  if (loading) {
    return <div className="loading-container">Cargando usuarios...</div>;
  }

  return (
    <div className="user-management">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Dashboard
      </button>

      <div className="page-header">
        <h1>👥 Gestión de Usuarios</h1>
        <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
          ➕ Crear Usuario
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-label">Total Usuarios</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👑 Admins</div>
          <div className="stat-value">{stats.admins}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👁️ Revisores</div>
          <div className="stat-value">{stats.revisores}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👨‍🏫 Docentes</div>
          <div className="stat-value">{stats.docentes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👨‍🎓 Estudiantes</div>
          <div className="stat-value">{stats.estudiantes}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-label">⏳ Pendientes</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrar por Rol:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="admin">👑 Admin</option>
            <option value="revisor">👁️ Revisor</option>
            <option value="docente">👨‍🏫 Docente</option>
            <option value="estudiante">👨‍🎓 Estudiante</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filtrar por Estado:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="active">✅ Activos</option>
            <option value="pending">⏳ Pendientes</option>
            <option value="suspended">🚫 Suspendidos</option>
            <option value="rejected">❌ Rechazados</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Organización</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-message">
                  No hay usuarios con estos filtros
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <strong>{u.user_name}</strong>
                      {u._id === user._id && <span className="badge-you">TÚ</span>}
                    </div>
                  </td>
                  <td>{u.email || '-'}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role === 'admin' && '👑 Admin'}
                      {u.role === 'revisor' && '👁️ Revisor'}
                      {u.role === 'docente' && '👨‍🏫 Docente'}
                      {u.role === 'estudiante' && '👨‍🎓 Estudiante'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${u.status}`}>
                      {u.status === 'active' && '✅ Activo'}
                      {u.status === 'pending' && '⏳ Pendiente'}
                      {u.status === 'suspended' && '🚫 Suspendido'}
                      {u.status === 'rejected' && '❌ Rechazado'}
                    </span>
                  </td>
                  <td>
                    {u.organization_id?.name || '-'}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {u.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action approve"
                            onClick={() => handleApprove(u._id)}
                            title="Aprobar"
                          >
                            ✅
                          </button>
                          <button 
                            className="btn-action reject"
                            onClick={() => handleReject(u._id)}
                            title="Rechazar"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {u.status === 'active' && u._id !== user._id && (
                        <button 
                          className="btn-action suspend"
                          onClick={() => handleSuspend(u._id)}
                          title="Suspender"
                        >
                          🚫
                        </button>
                      )}
                      {(u.status === 'suspended' || u.status === 'rejected') && (
                        <button 
                          className="btn-action activate"
                          onClick={() => handleActivate(u._id)}
                          title="Activar"
                        >
                          ✅
                        </button>
                      )}
                      {u._id !== user._id && (
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDelete(u._id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>➕ Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Nombre de Usuario *</label>
                <input
                  type="text"
                  value={newUser.user_name}
                  onChange={(e) => setNewUser({...newUser, user_name: e.target.value})}
                  required
                  minLength={3}
                  placeholder="usuario123"
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  required
                >
                  <option value="estudiante">👨‍🎓 Estudiante</option>
                  <option value="docente">👨‍🏫 Docente</option>
                  <option value="revisor">👁️ Revisor</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Organización</label>
                <select
                  value={newUser.organization_id}
                  onChange={(e) => setNewUser({...newUser, organization_id: e.target.value})}
                >
                  <option value="">Sin organización</option>
                  {organizations.map(org => (
                    <option key={org._id} value={org._id}>{org.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Estado *</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  required
                >
                  <option value="active">✅ Activo</option>
                  <option value="pending">⏳ Pendiente</option>
                  <option value="suspended">🚫 Suspendido</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  ✅ Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

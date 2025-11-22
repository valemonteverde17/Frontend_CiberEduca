import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './UserManagement.css';

export default function UserManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get('/users/pending');
      setPendingUsers(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar usuarios pendientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.patch(`/users/${userId}/status`, { status });
      // Remover de la lista local
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
      alert(`Usuario ${status === 'active' ? 'aprobado' : 'rechazado'} exitosamente.`);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar estado.');
    }
  };

  return (
    <div className="user-management-page">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Panel
      </button>
      
      <div className="header">
        <h1>Gestión de Usuarios Pendientes</h1>
        <p>Aprueba o rechaza las solicitudes de registro.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : pendingUsers.length === 0 ? (
        <div className="empty-state">
          <p>✨ No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol Solicitado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.user_name}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'docente' ? '👨‍🏫 Docente' : '👨‍🎓 Estudiante'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-approve"
                      onClick={() => handleStatusChange(user._id, 'active')}
                    >
                      ✓ Aprobar
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleStatusChange(user._id, 'rejected')}
                    >
                      ✗ Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

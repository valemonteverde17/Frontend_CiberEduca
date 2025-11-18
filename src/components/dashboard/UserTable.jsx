import { useState } from 'react';
import './UserTable.css';

export default function UserTable({ 
  users, 
  onApprove, 
  onReject, 
  onSuspend, 
  onActivate, 
  onDelete,
  showActions = true,
  canManage = false 
}) {
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.user_name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    const icons = {
      admin: '🛡️',
      revisor: '👁️',
      docente: '👨‍🏫',
      estudiante: '👨‍🎓'
    };
    return icons[role] || '👤';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Activo', class: 'status-active' },
      pending: { text: 'Pendiente', class: 'status-pending' },
      suspended: { text: 'Suspendido', class: 'status-suspended' },
      rejected: { text: 'Rechazado', class: 'status-rejected' }
    };
    return badges[status] || { text: status, class: '' };
  };

  return (
    <div className="user-table-container">
      <div className="user-table-filters">
        <input
          type="search"
          placeholder="🔍 Buscar por nombre o email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="user-table-search"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="user-table-role-filter"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="revisor">Revisor</option>
          <option value="docente">Docente</option>
          <option value="estudiante">Estudiante</option>
        </select>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Organización</th>
              {showActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="user-table-empty">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const statusBadge = getStatusBadge(user.status);
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="user-table-user">
                        <span className="user-table-icon">{getRoleIcon(user.role)}</span>
                        <span className="user-table-name">{user.user_name}</span>
                        {user.is_super && <span className="user-table-super">👑 SUPER</span>}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-table-role role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`user-table-status ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      {user.organization_id?.name || (
                        <span className="user-table-no-org">Sin organización</span>
                      )}
                    </td>
                    {showActions && (
                      <td>
                        <div className="user-table-actions">
                          {user.status === 'pending' && canManage && (
                            <>
                              <button
                                className="user-table-btn btn-approve"
                                onClick={() => onApprove(user._id)}
                                title="Aprobar"
                              >
                                ✅
                              </button>
                              <button
                                className="user-table-btn btn-reject"
                                onClick={() => onReject(user._id)}
                                title="Rechazar"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          {user.status === 'active' && canManage && (
                            <button
                              className="user-table-btn btn-suspend"
                              onClick={() => onSuspend(user._id)}
                              title="Suspender"
                            >
                              🚫
                            </button>
                          )}
                          {user.status === 'suspended' && canManage && (
                            <button
                              className="user-table-btn btn-activate"
                              onClick={() => onActivate(user._id)}
                              title="Activar"
                            >
                              ✅
                            </button>
                          )}
                          {canManage && !user.is_super && (
                            <button
                              className="user-table-btn btn-delete"
                              onClick={() => onDelete(user._id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="user-table-footer">
        <p>Mostrando {filteredUsers.length} de {users.length} usuarios</p>
      </div>
    </div>
  );
}

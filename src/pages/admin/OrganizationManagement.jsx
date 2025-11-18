import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './OrganizationManagement.css';

export default function OrganizationManagement() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    code: '',
    admin_id: '',
    logo: '',
    settings: {
      allowPublicContent: true,
      requireApproval: true
    }
  });

  useEffect(() => {
    loadOrganizations();
    loadAdmins();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/organizations');
      setOrganizations(res.data);
    } catch (err) {
      console.error('Error al cargar organizaciones:', err);
      alert('Error al cargar organizaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const res = await axios.get('/users');
      const adminUsers = res.data.filter(u => u.role === 'admin');
      setAdmins(adminUsers);
    } catch (err) {
      console.error('Error al cargar admins:', err);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/organizations', newOrg);
      await loadOrganizations();
      setShowCreateModal(false);
      setNewOrg({
        name: '',
        description: '',
        code: '',
        admin_id: '',
        logo: '',
        settings: {
          allowPublicContent: true,
          requireApproval: true
        }
      });
      alert('✅ Organización creada exitosamente');
    } catch (err) {
      alert('❌ Error al crear organización: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (org) => {
    setEditingOrg({
      _id: org._id,
      name: org.name,
      description: org.description || '',
      code: org.code,
      admin_id: typeof org.admin_id === 'object' ? org.admin_id._id : org.admin_id,
      logo: org.logo || '',
      settings: {
        allowPublicContent: org.settings?.allowPublicContent ?? true,
        requireApproval: org.settings?.requireApproval ?? true
      }
    });
    setShowEditModal(true);
  };

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...updateData } = editingOrg;
      await axios.patch(`/organizations/${_id}`, updateData);
      await loadOrganizations();
      setShowEditModal(false);
      setEditingOrg(null);
      alert('✅ Organización actualizada');
    } catch (err) {
      alert('❌ Error al actualizar organización: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (orgId) => {
    if (!window.confirm('⚠️ ¿ELIMINAR esta organización? Esto afectará a todos los usuarios asociados.')) return;
    try {
      await axios.delete(`/organizations/${orgId}`);
      await loadOrganizations();
      alert('✅ Organización eliminada');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewOrg({...newOrg, code});
  };

  if (loading) {
    return <div className="loading-container">Cargando organizaciones...</div>;
  }

  return (
    <div className="org-management">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Dashboard
      </button>

      <div className="page-header">
        <h1>🏢 Gestión de Organizaciones</h1>
        <button className="btn-create-org" onClick={() => setShowCreateModal(true)}>
          ➕ Crear Organización
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-label">Total Organizaciones</div>
          <div className="stat-value">{organizations.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👤 Admin</div>
          <div className="stat-value">
            {organizations.filter(o => o.admin_id).length}
          </div>
        </div>
      </div>

      {/* Grid de Organizaciones */}
      <div className="orgs-grid">
        {organizations.length === 0 ? (
          <div className="empty-state">
            <p>📭 No hay organizaciones creadas</p>
            <button className="btn-create-first" onClick={() => setShowCreateModal(true)}>
              Crear Primera Organización
            </button>
          </div>
        ) : (
          organizations.map((org) => (
            <div key={org._id} className="org-card">
              <div className="org-header">
                <h3>{org.name}</h3>
              </div>
              
              <p className="org-description">{org.description || 'Sin descripción'}</p>
              
              <div className="org-details">
                <div className="detail-item">
                  <strong>Código:</strong>
                  <span className="org-code">{org.code}</span>
                </div>
                <div className="detail-item">
                  <strong>👤 Admin:</strong>
                  <span>{org.admin_id?.user_name || org.admin_id || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>🌐 Contenido Público:</strong>
                  <span>{org.settings?.allowPublicContent ? '✅ Sí' : '❌ No'}</span>
                </div>
                <div className="detail-item">
                  <strong>✅ Requiere Aprobación:</strong>
                  <span>{org.settings?.requireApproval ? '✅ Sí' : '❌ No'}</span>
                </div>
                <div className="detail-item">
                  <strong>📅 Creada:</strong>
                  <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="org-actions">
                <button 
                  className="btn-edit-org"
                  onClick={() => handleEdit(org)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-delete-org"
                  onClick={() => handleDelete(org._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear Organización */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>➕ Crear Nueva Organización</h2>
            <form onSubmit={handleCreateOrg}>
              <div className="form-group">
                <label>Nombre de la Organización *</label>
                <input
                  type="text"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                  required
                  placeholder="Ej: Escuela Primaria Benito Juárez"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({...newOrg, description: e.target.value})}
                  rows={3}
                  placeholder="Descripción de la organización..."
                />
              </div>

              <div className="form-group">
                <label>Código de Acceso *</label>
                <div className="code-input-group">
                  <input
                    type="text"
                    value={newOrg.code}
                    onChange={(e) => setNewOrg({...newOrg, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="CODIGO"
                    maxLength={10}
                  />
                  <button 
                    type="button" 
                    className="btn-generate-code"
                    onClick={generateCode}
                  >
                    🎲 Generar
                  </button>
                </div>
                <small>Este código será usado por docentes para unirse a la organización</small>
              </div>

              <div className="form-group">
                <label>Administrador *</label>
                <select
                  value={newOrg.admin_id}
                  onChange={(e) => setNewOrg({...newOrg, admin_id: e.target.value})}
                  required
                >
                  <option value="">Selecciona un administrador</option>
                  {admins.map(admin => (
                    <option key={admin._id} value={admin._id}>
                      {admin.user_name} ({admin.profile?.fullName || 'Sin nombre'})
                    </option>
                  ))}
                </select>
                <small>Selecciona el usuario que administrará esta organización</small>
              </div>

              <div className="form-group">
                <label>Logo (URL)</label>
                <input
                  type="url"
                  value={newOrg.logo}
                  onChange={(e) => setNewOrg({...newOrg, logo: e.target.value})}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newOrg.settings.allowPublicContent}
                    onChange={(e) => setNewOrg({
                      ...newOrg,
                      settings: {...newOrg.settings, allowPublicContent: e.target.checked}
                    })}
                  />
                  {' '}Permitir contenido público
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newOrg.settings.requireApproval}
                    onChange={(e) => setNewOrg({
                      ...newOrg,
                      settings: {...newOrg.settings, requireApproval: e.target.checked}
                    })}
                  />
                  {' '}Requiere aprobación de contenido
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  ✅ Crear Organización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Organización */}
      {showEditModal && editingOrg && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Editar Organización</h2>
            <form onSubmit={handleUpdateOrg}>
              <div className="form-group">
                <label>Nombre de la Organización *</label>
                <input
                  type="text"
                  value={editingOrg.name}
                  onChange={(e) => setEditingOrg({...editingOrg, name: e.target.value})}
                  required
                  placeholder="Ej: Escuela Primaria Benito Juárez"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={editingOrg.description}
                  onChange={(e) => setEditingOrg({...editingOrg, description: e.target.value})}
                  rows={3}
                  placeholder="Descripción de la organización..."
                />
              </div>

              <div className="form-group">
                <label>Código de Acceso *</label>
                <input
                  type="text"
                  value={editingOrg.code}
                  onChange={(e) => setEditingOrg({...editingOrg, code: e.target.value.toUpperCase()})}
                  required
                  placeholder="CODIGO"
                  maxLength={10}
                />
                <small>Este código será usado por docentes para unirse a la organización</small>
              </div>

              <div className="form-group">
                <label>Administrador *</label>
                <select
                  value={editingOrg.admin_id}
                  onChange={(e) => setEditingOrg({...editingOrg, admin_id: e.target.value})}
                  required
                >
                  <option value="">Selecciona un administrador</option>
                  {admins.map(admin => (
                    <option key={admin._id} value={admin._id}>
                      {admin.user_name} ({admin.profile?.fullName || 'Sin nombre'})
                    </option>
                  ))}
                </select>
                <small>Selecciona el usuario que administrará esta organización</small>
              </div>

              <div className="form-group">
                <label>Logo (URL)</label>
                <input
                  type="url"
                  value={editingOrg.logo}
                  onChange={(e) => setEditingOrg({...editingOrg, logo: e.target.value})}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingOrg.settings.allowPublicContent}
                    onChange={(e) => setEditingOrg({
                      ...editingOrg,
                      settings: {...editingOrg.settings, allowPublicContent: e.target.checked}
                    })}
                  />
                  {' '}Permitir contenido público
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingOrg.settings.requireApproval}
                    onChange={(e) => setEditingOrg({
                      ...editingOrg,
                      settings: {...editingOrg.settings, requireApproval: e.target.checked}
                    })}
                  />
                  {' '}Requiere aprobación de contenido
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  ✅ Actualizar Organización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

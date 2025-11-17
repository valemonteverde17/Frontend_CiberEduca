import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './OrganizationManagement.css';

export default function OrganizationManagement() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    code: '',
    type: 'school',
    contact: {
      email: '',
      phone: '',
      address: ''
    }
  });

  useEffect(() => {
    loadOrganizations();
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
        type: 'school',
        contact: {
          email: '',
          phone: '',
          address: ''
        }
      });
      alert('✅ Organización creada exitosamente');
    } catch (err) {
      alert('❌ Error al crear organización: ' + (err.response?.data?.message || err.message));
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
          <div className="stat-label">🏫 Escuelas</div>
          <div className="stat-value">
            {organizations.filter(o => o.type === 'school').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🏛️ Universidades</div>
          <div className="stat-value">
            {organizations.filter(o => o.type === 'university').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🏢 Empresas</div>
          <div className="stat-value">
            {organizations.filter(o => o.type === 'company').length}
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
                <span className={`org-type type-${org.type}`}>
                  {org.type === 'school' && '🏫 Escuela'}
                  {org.type === 'university' && '🏛️ Universidad'}
                  {org.type === 'company' && '🏢 Empresa'}
                  {org.type === 'other' && '📋 Otro'}
                </span>
              </div>
              
              <p className="org-description">{org.description || 'Sin descripción'}</p>
              
              <div className="org-details">
                <div className="detail-item">
                  <strong>Código:</strong>
                  <span className="org-code">{org.code}</span>
                </div>
                {org.contact?.email && (
                  <div className="detail-item">
                    <strong>📧 Email:</strong>
                    <span>{org.contact.email}</span>
                  </div>
                )}
                {org.contact?.phone && (
                  <div className="detail-item">
                    <strong>📞 Teléfono:</strong>
                    <span>{org.contact.phone}</span>
                  </div>
                )}
                {org.contact?.address && (
                  <div className="detail-item">
                    <strong>📍 Dirección:</strong>
                    <span>{org.contact.address}</span>
                  </div>
                )}
                <div className="detail-item">
                  <strong>📅 Creada:</strong>
                  <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="org-actions">
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
                <label>Tipo de Organización *</label>
                <select
                  value={newOrg.type}
                  onChange={(e) => setNewOrg({...newOrg, type: e.target.value})}
                  required
                >
                  <option value="school">🏫 Escuela</option>
                  <option value="university">🏛️ Universidad</option>
                  <option value="company">🏢 Empresa</option>
                  <option value="other">📋 Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email de Contacto</label>
                <input
                  type="email"
                  value={newOrg.contact.email}
                  onChange={(e) => setNewOrg({
                    ...newOrg, 
                    contact: {...newOrg.contact, email: e.target.value}
                  })}
                  placeholder="contacto@organizacion.com"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={newOrg.contact.phone}
                  onChange={(e) => setNewOrg({
                    ...newOrg, 
                    contact: {...newOrg.contact, phone: e.target.value}
                  })}
                  placeholder="555-1234-5678"
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={newOrg.contact.address}
                  onChange={(e) => setNewOrg({
                    ...newOrg, 
                    contact: {...newOrg.contact, address: e.target.value}
                  })}
                  placeholder="Calle, Número, Colonia, Ciudad"
                />
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
    </div>
  );
}

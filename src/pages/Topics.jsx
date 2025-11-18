import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TopicCard from '../components/topics/TopicCard';
import { canCreateTopic, getHelpMessage } from '../utils/topicPermissions';
import './Topics.css';

export default function Topics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({ name: '', description: '', id: '', cardColor: '#2b9997', tags: [], difficulty: 'beginner' });
  const [tagsInput, setTagsInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTopics = async () => {
    setLoading(true);
    try {
      // El endpoint /topics ya filtra según permisos del usuario autenticado
      const res = await axios.get('/topics');
      setTopics(res.data || []);
    } catch (err) {
      console.error('Error al cargar temas:', err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = () => {
    setModalType('add');
    setModalData({ name: '', description: '', id: '', cardColor: '#2b9997', tags: [], difficulty: 'beginner' });
    setTagsInput('');
    setShowModal(true);
  };

  const handleAddSubmit = async () => {
    if (!modalData.name || modalData.description.length < 10) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    // Convertir tags de string a array
    const tagsArray = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    try {
      await axios.post('/topics', { 
        topic_name: modalData.name, 
        description: modalData.description,
        cardColor: modalData.cardColor,
        organization_id: user.organization_id || undefined,
        status: 'draft',
        visibility: user.organization_id ? 'organization' : 'public',
        difficulty: modalData.difficulty || 'beginner',
        tags: tagsArray
      });
      await fetchTopics();
      setShowModal(false);
      alert('✅ Tema creado en modo borrador');
    } catch (err) {
      alert('Error al agregar tema: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (topic) => {
    setModalType('edit');
    setModalData({ 
      name: topic.topic_name, 
      description: topic.description, 
      id: topic._id,
      cardColor: topic.cardColor || '#2b9997',
      tags: topic.tags || [],
      difficulty: topic.difficulty || 'beginner'
    });
    setTagsInput(Array.isArray(topic.tags) ? topic.tags.join(', ') : '');
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!modalData.name || !modalData.description) return;
    // Convertir tags de string a array
    const tagsArray = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    try {
      await axios.patch(`/topics/${modalData.id}`, {
        topic_name: modalData.name,
        description: modalData.description,
        cardColor: modalData.cardColor,
        tags: tagsArray,
        difficulty: modalData.difficulty
      });
      fetchTopics();
      setShowModal(false);
    } catch (err) {
      alert('Error al editar tema');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ ¿Eliminar este tema permanentemente?')) return;
    try {
      await axios.delete(`/topics/${id}`);
      await fetchTopics();
      alert('Tema eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar tema');
    }
  };

  const handleSubmitForReview = async (topicId) => {
    if (!window.confirm('¿Enviar este tema a revisión? Una vez enviado, no podrás editarlo hasta que sea revisado.')) return;
    try {
      await axios.post(`/topics/${topicId}/submit-review`);
      await fetchTopics();
      alert('✅ Tema enviado a revisión exitosamente');
    } catch (err) {
      alert('Error al enviar a revisión: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async (topicId) => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/approve`);
      await fetchTopics();
      alert('✅ Tema aprobado exitosamente');
    } catch (err) {
      alert('Error al aprobar tema: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (topicId) => {
    const comments = prompt('Comentarios de rechazo (requerido):');
    if (!comments) {
      alert('Debes proporcionar comentarios para rechazar un tema');
      return;
    }
    try {
      await axios.post(`/topics/${topicId}/reject`, { comments });
      await fetchTopics();
      alert('Tema rechazado');
    } catch (err) {
      alert('Error al rechazar tema');
    }
  };

  const handleArchive = async (topicId) => {
    if (!window.confirm('¿Archivar este tema?')) return;
    try {
      await axios.post(`/topics/${topicId}/archive`);
      await fetchTopics();
      alert('Tema archivado');
    } catch (err) {
      alert('Error al archivar tema');
    }
  };

  // Filtrar temas
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || topic.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="topics-loading">
        <div className="loading-spinner"></div>
        <p>Cargando temas...</p>
      </div>
    );
  }

  return (
    <div className="topics-container">
      {/* Header */}
      <div className="topics-header">
        <div>
          <h1>📚 Temas Educativos</h1>
          <p className="topics-subtitle">{getHelpMessage(user)}</p>
        </div>
        {canCreateTopic(user) && (
          <button className="btn-add" onClick={handleAdd}>
            ➕ Nuevo Tema
          </button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="topics-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos ({topics.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            ✅ Aprobados ({topics.filter(t => t.status === 'approved').length})
          </button>
          {canCreateTopic(user) && (
            <>
              <button
                className={`filter-tab ${filterStatus === 'draft' ? 'active' : ''}`}
                onClick={() => setFilterStatus('draft')}
              >
                📝 Borradores ({topics.filter(t => t.status === 'draft').length})
              </button>
              <button
                className={`filter-tab ${filterStatus === 'pending_review' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending_review')}
              >
                ⏳ En Revisión ({topics.filter(t => t.status === 'pending_review').length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid de temas */}
      {filteredTopics.length === 0 ? (
        <div className="topics-empty">
          <p>No se encontraron temas</p>
        </div>
      ) : (
        <div className="topics-grid-modern">
          {filteredTopics.map(topic => (
            <TopicCard
              key={topic._id}
              topic={topic}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSubmitReview={handleSubmitForReview}
              onApprove={handleApprove}
              onReject={handleReject}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'add' ? 'Nuevo Tema' : 'Editar Tema'}</h3>
            <input
              type="text"
              placeholder="Nombre del tema"
              value={modalData.name}
              onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              className="modal-input"
            />
            <textarea
              placeholder="Descripción (mínimo 10 caracteres)"
              value={modalData.description}
              onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
              className="modal-textarea"
              rows={4}
            />

            <div className="form-group">
              <label className="form-label">🏷️ Tags (separados por coma)</label>
              <input
                type="text"
                placeholder="Ej: ciberseguridad, contraseñas, seguridad"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">📊 Dificultad</label>
              <select
                value={modalData.difficulty}
                onChange={(e) => setModalData({ ...modalData, difficulty: e.target.value })}
                className="modal-select"
              >
                <option value="beginner">🟢 Principiante</option>
                <option value="intermediate">🟡 Intermedio</option>
                <option value="advanced">🔴 Avanzado</option>
              </select>
            </div>
            
            <div className="color-picker-section">
              <label className="color-picker-label">
                🎨 Color de la Card
              </label>
              <div className="color-picker-full">
                <div className="color-presets-row">
                  <span className="presets-label">Colores rápidos:</span>
                  {[
                    { name: 'Verde Agua', value: '#2b9997' },
                    { name: 'Azul', value: '#3b82f6' },
                    { name: 'Morado', value: '#8b5cf6' },
                    { name: 'Rosa', value: '#ec4899' },
                    { name: 'Naranja', value: '#f97316' },
                    { name: 'Verde', value: '#10b981' },
                    { name: 'Rojo', value: '#ef4444' },
                    { name: 'Amarillo', value: '#f59e0b' }
                  ].map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-preset-btn-small ${modalData.cardColor === color.value ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setModalData({ ...modalData, cardColor: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <div className="color-custom-picker">
                  <label className="custom-picker-label">Color personalizado:</label>
                  <input
                    type="color"
                    className="color-picker-input-large"
                    value={modalData.cardColor}
                    onChange={(e) => setModalData({ ...modalData, cardColor: e.target.value })}
                    title="Selector de color RGB completo"
                  />
                  <input
                    type="text"
                    className="color-hex-input"
                    value={modalData.cardColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setModalData({ ...modalData, cardColor: value });
                      }
                    }}
                    placeholder="#2b9997"
                    maxLength={7}
                  />
                </div>
                
                <div className="color-preview-large" style={{ backgroundColor: modalData.cardColor }}>
                  <span>Vista previa del color de la card</span>
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)} className="btn-cancel">
                Cancelar
              </button>
              <button 
                onClick={modalType === 'add' ? handleAddSubmit : handleEditSubmit} 
                className="btn-confirm"
              >
                {modalType === 'add' ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

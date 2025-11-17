import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import iconEdit from '../assets/icons/editar.png';
import iconDelete from '../assets/icons/eliminar.png';
import './Topics.css';

export default function Topics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({ name: '', description: '', id: '', cardColor: '#2b9997' });
  const itemsPerPage = 3;

  const fetchTopics = async () => {
    try {
      // Filtrar temas según permisos del usuario
      const res = await axios.get('/topics/by-permissions');
      setTopics(res.data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
      // Fallback a todos los temas si el endpoint no existe aún
      try {
        const fallbackRes = await axios.get('/topics');
        setTopics(fallbackRes.data);
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr);
      }
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = () => {
    setModalType('add');
    setModalData({ name: '', description: '', id: '', cardColor: '#2b9997' });
    setShowModal(true);
  };

  const handleAddSubmit = async () => {
    if (!modalData.name || modalData.description.length < 10) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    try {
      await axios.post('/topics', { 
        topic_name: modalData.name, 
        description: modalData.description,
        cardColor: modalData.cardColor,
        created_by: user._id,
        organization_id: user.organization_id || null,
        status: 'draft',
        visibility: 'public'
      });
      fetchTopics();
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
      cardColor: topic.cardColor || '#2b9997'
    });
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!modalData.name || !modalData.description) return;
    try {
      await axios.patch(`/topics/${modalData.id}`, {
        topic_name: modalData.name,
        description: modalData.description,
        cardColor: modalData.cardColor
      });
      fetchTopics();
      setShowModal(false);
    } catch (err) {
      alert('Error al editar tema');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este tema?')) return;
    try {
      await axios.delete(`/topics/${id}`);
      fetchTopics();
    } catch (err) {
      alert('Error al eliminar tema');
    }
  };

  const getCardClass = (index) => {
    return ['topic-yellow', 'topic-teal', 'topic-red'][index % 3];
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(topics.length - itemsPerPage, prev + 1));
  };

  const handleTopicClick = (topicId) => {
    navigate(`/topics/${topicId}`);
  };

  const visibleTopics = topics.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="topics-container">
      <div className="topics-header">
        <h2>{user.role === 'docente' ? 'Gestión de Temas' : 'Explora los Temas'}</h2>
        {user.role === 'docente' && (
          <button className="btn-add" onClick={handleAdd}>+ Nuevo Tema</button>
        )}
      </div>
      
      <div className="carousel-container">
        <button 
          className="nav-arrow left" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀
        </button>
        
        <div className="topics-grid">
          {visibleTopics.map((topic, index) => (
            <div 
              key={topic._id} 
              className={`topic-card ${getCardClass(currentIndex + index)}`}
              onClick={() => handleTopicClick(topic._id)}
              style={{ 
                background: topic.cardColor 
                  ? `linear-gradient(135deg, ${topic.cardColor} 0%, ${topic.cardColor}dd 100%)`
                  : undefined
              }}
            >
              {/* Badge de estado */}
              {topic.status && topic.status !== 'approved' && (
                <div className={`topic-status-badge status-${topic.status}`}>
                  {topic.status === 'draft' && '📝 Borrador'}
                  {topic.status === 'pending_review' && '⏳ En Revisión'}
                  {topic.status === 'rejected' && '❌ Rechazado'}
                  {topic.status === 'archived' && '🗄️ Archivado'}
                </div>
              )}
              
              {user.role === 'docente' && (
                <div className="topic-actions">
                  <img 
                    src={iconDelete} 
                    className="topic-icon delete" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(topic._id); }} 
                    alt="Eliminar"
                  />
                  <img 
                    src={iconEdit} 
                    className="topic-icon edit" 
                    onClick={(e) => { e.stopPropagation(); handleEdit(topic); }} 
                    alt="Editar"
                  />
                </div>
              )}
              <div className="topic-content">
                <div className="topic-title">{topic.topic_name}</div>
                <div className="topic-description">{topic.description}</div>
                <div className="topic-footer">Click para ver más →</div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="nav-arrow right" 
          onClick={handleNext}
          disabled={currentIndex >= topics.length - itemsPerPage}
        >
          ▶
        </button>
      </div>

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

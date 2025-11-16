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
  const [modalData, setModalData] = useState({ name: '', description: '', id: '' });
  const itemsPerPage = 3;

  const fetchTopics = async () => {
    try {
      const res = await axios.get('/topics');
      setTopics(res.data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = () => {
    setModalType('add');
    setModalData({ name: '', description: '', id: '' });
    setShowModal(true);
  };

  const handleAddSubmit = async () => {
    if (!modalData.name || modalData.description.length < 10) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    try {
      await axios.post('/topics', { topic_name: modalData.name, description: modalData.description });
      fetchTopics();
      setShowModal(false);
    } catch (err) {
      alert('Error al agregar tema');
    }
  };

  const handleEdit = (topic) => {
    setModalType('edit');
    setModalData({ name: topic.topic_name, description: topic.description, id: topic._id });
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!modalData.name || !modalData.description) return;
    try {
      await axios.patch(`/topics/${modalData.id}`, {
        topic_name: modalData.name,
        description: modalData.description,
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
            >
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

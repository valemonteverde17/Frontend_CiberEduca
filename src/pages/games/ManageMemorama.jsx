import './ManageMemorama.css';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function ManageMemorama() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estado del formulario
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('easy');

  // Estado de edición
  const [editingId, setEditingId] = useState(null);
  const [editConcept, setEditConcept] = useState('');
  const [editDefinition, setEditDefinition] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('easy');

  useEffect(() => {
    if (user?.role !== 'docente') {
      navigate('/memorama');
      return;
    }
    loadTopics();
  }, [user, navigate]);

  const loadTopics = async () => {
    try {
      const res = await axios.get('/topics');
      setTopics(res.data);
    } catch (err) {
      console.error('Error al cargar temas', err);
    }
  };

  const loadPairs = async (topicId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/memorama/topic/${topicId}`);
      setPairs(res.data);
    } catch (err) {
      console.error('Error al cargar pares:', err);
      setMessage('Error al cargar los pares');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    if (topicId) {
      loadPairs(topicId);
    } else {
      setPairs([]);
    }
  };

  const handleAddPair = async (e) => {
    e.preventDefault();

    if (!newConcept.trim() || !newDefinition.trim() || !selectedTopic) {
      setMessage('❌ Completa todos los campos obligatorios.');
      return;
    }

    try {
      await axios.post('/memorama', {
        concept: newConcept,
        definition: newDefinition,
        difficulty: newDifficulty,
        topic_id: selectedTopic,
        user_id: user._id
      });

      setMessage('✓ Par agregado correctamente.');
      setNewConcept('');
      setNewDefinition('');
      setNewDifficulty('easy');
      setShowAddForm(false);
      loadPairs(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al agregar el par.');
    }
  };

  const handleEdit = (pair) => {
    setEditingId(pair._id);
    setEditConcept(pair.concept);
    setEditDefinition(pair.definition);
    setEditDifficulty(pair.difficulty);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditConcept('');
    setEditDefinition('');
    setEditDifficulty('easy');
  };

  const handleUpdatePair = async (id) => {
    if (!editConcept.trim() || !editDefinition.trim()) {
      setMessage('❌ Completa todos los campos obligatorios.');
      return;
    }

    try {
      await axios.patch(`/memorama/${id}`, {
        concept: editConcept,
        definition: editDefinition,
        difficulty: editDifficulty
      });

      setMessage('✓ Par actualizado correctamente.');
      setEditingId(null);
      loadPairs(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al actualizar el par.');
    }
  };

  const handleDeletePair = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este par?')) return;

    try {
      await axios.delete(`/memorama/${id}`);
      setMessage('✓ Par eliminado correctamente.');
      loadPairs(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al eliminar el par.');
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { text: 'Fácil', color: '#4caf50' },
      medium: { text: 'Medio', color: '#ff9800' },
      hard: { text: 'Difícil', color: '#f44336' }
    };
    return badges[difficulty] || badges.easy;
  };

  return (
    <div className="manage-memorama-page">
      <div className="manage-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Volver a Juegos
        </button>
        <button className="play-button" onClick={() => navigate('/memorama')}>
          🎮 Jugar Memorama
        </button>
      </div>

      <div className="manage-container">
        <div className="page-header">
          <h1>🧠 Gestión de Pares - Memorama</h1>
          <p className="subtitle">Administra los pares de conceptos y definiciones</p>
        </div>

        <div className="topic-selector-card">
          <label>📚 Selecciona un tema:</label>
          <select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">-- Selecciona un tema --</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.topic_name}</option>
            ))}
          </select>
        </div>

        {selectedTopic && (
          <div className="add-section">
            <button
              className="btn-toggle-add"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✖ Cancelar' : '+ Agregar Nuevo Par'}
            </button>

            {showAddForm && (
              <form className="add-form" onSubmit={handleAddPair}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Concepto *</label>
                    <input
                      type="text"
                      value={newConcept}
                      onChange={(e) => setNewConcept(e.target.value)}
                      placeholder="Ej: Phishing"
                      required
                    />
                    <small>El término o concepto principal</small>
                  </div>

                  <div className="form-group">
                    <label>Dificultad *</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value)}
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Medio</option>
                      <option value="hard">Difícil</option>
                    </select>
                    <small>Nivel de dificultad del par</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Definición *</label>
                  <textarea
                    value={newDefinition}
                    onChange={(e) => setNewDefinition(e.target.value)}
                    placeholder="Ej: Estafa digital mediante correos falsos que buscan robar información personal"
                    rows={3}
                    required
                  />
                  <small>La definición o descripción del concepto</small>
                </div>

                <button type="submit" className="btn-submit">
                  ✓ Guardar Par
                </button>
              </form>
            )}
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Cargando pares...</p>
          </div>
        )}

        {!loading && selectedTopic && pairs.length === 0 && (
          <div className="no-pairs">
            <p>🧠 No hay pares registrados para este tema.</p>
            <p className="hint">Agrega el primer par usando el botón de arriba.</p>
          </div>
        )}

        {!loading && pairs.length > 0 && (
          <div className="pairs-list">
            <h2>Pares Registrados ({pairs.length})</h2>
            <div className="pairs-grid">
              {pairs.map((pair) => (
                <div key={pair._id} className="pair-card">
                  {editingId === pair._id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Concepto</label>
                        <input
                          type="text"
                          value={editConcept}
                          onChange={(e) => setEditConcept(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Definición</label>
                        <textarea
                          value={editDefinition}
                          onChange={(e) => setEditDefinition(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="form-group">
                        <label>Dificultad</label>
                        <select
                          value={editDifficulty}
                          onChange={(e) => setEditDifficulty(e.target.value)}
                        >
                          <option value="easy">Fácil</option>
                          <option value="medium">Medio</option>
                          <option value="hard">Difícil</option>
                        </select>
                      </div>
                      <div className="edit-actions">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdatePair(pair._id)}
                        >
                          ✓ Guardar
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={handleCancelEdit}
                        >
                          ✖ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pair-header">
                        <span className="pair-concept">{pair.concept}</span>
                        <span
                          className="difficulty-badge"
                          style={{ background: getDifficultyBadge(pair.difficulty).color }}
                        >
                          {getDifficultyBadge(pair.difficulty).text}
                        </span>
                      </div>
                      <div className="pair-definition">
                        {pair.definition}
                      </div>
                      <div className="pair-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(pair)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeletePair(pair._id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

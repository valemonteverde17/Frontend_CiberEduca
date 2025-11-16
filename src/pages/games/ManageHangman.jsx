import './ManageHangman.css';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function ManageHangman() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estado del formulario
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newHint, setNewHint] = useState('');

  // Estado de edición
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editHint, setEditHint] = useState('');

  useEffect(() => {
    if (user?.role !== 'docente') {
      navigate('/hangman');
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

  const loadWords = async (topicId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/hangman?topic_id=${topicId}`);
      setWords(res.data);
    } catch (err) {
      console.error('Error al cargar palabras:', err);
      setMessage('Error al cargar las palabras');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    if (topicId) {
      loadWords(topicId);
    } else {
      setWords([]);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();

    if (!newWord.trim() || !newTitle.trim() || !selectedTopic) {
      setMessage('❌ Completa todos los campos obligatorios.');
      return;
    }

    try {
      await axios.post('/hangman', {
        word: newWord.toUpperCase(),
        title: newTitle.toLowerCase().replace(/\s+/g, '_'),
        hint: newHint.trim(),
        topic_id: selectedTopic,
        user_id: user._id
      });

      setMessage('✓ Palabra agregada correctamente.');
      setNewWord('');
      setNewTitle('');
      setNewHint('');
      setShowAddForm(false);
      loadWords(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al agregar la palabra.');
    }
  };

  const handleEdit = (word) => {
    setEditingId(word._id);
    setEditWord(word.word);
    setEditTitle(word.title);
    setEditHint(word.hint || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditWord('');
    setEditTitle('');
    setEditHint('');
  };

  const handleUpdateWord = async (id) => {
    if (!editWord.trim() || !editTitle.trim()) {
      setMessage('❌ Completa todos los campos obligatorios.');
      return;
    }

    try {
      await axios.patch(`/hangman/${id}`, {
        word: editWord.toUpperCase(),
        title: editTitle.toLowerCase().replace(/\s+/g, '_'),
        hint: editHint.trim()
      });

      setMessage('✓ Palabra actualizada correctamente.');
      setEditingId(null);
      loadWords(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al actualizar la palabra.');
    }
  };

  const handleDeleteWord = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta palabra?')) return;

    try {
      await axios.delete(`/hangman/${id}`);
      setMessage('✓ Palabra eliminada correctamente.');
      loadWords(selectedTopic);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al eliminar la palabra.');
    }
  };

  const formatTitle = (str) =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="manage-hangman-page">
      <div className="manage-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Volver a Juegos
        </button>
        <button className="play-button" onClick={() => navigate('/hangman')}>
          🎮 Jugar Ahorcado
        </button>
      </div>

      <div className="manage-container">
        <div className="page-header">
          <h1>📝 Gestión de Palabras - Ahorcado</h1>
          <p className="subtitle">Administra las palabras para el juego del ahorcado</p>
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
              {showAddForm ? '✖ Cancelar' : '+ Agregar Nueva Palabra'}
            </button>

            {showAddForm && (
              <form className="add-form" onSubmit={handleAddWord}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej: vpn_seguro"
                      required
                    />
                    <small>Usa guiones bajos para separar palabras</small>
                  </div>

                  <div className="form-group">
                    <label>Palabra *</label>
                    <input
                      type="text"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="Ej: ENCRIPTADO"
                      required
                    />
                    <small>La palabra que los estudiantes deben adivinar</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Pista (opcional)</label>
                  <textarea
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Ej: Proceso de convertir información en código secreto"
                    rows={3}
                  />
                  <small>Una ayuda para los estudiantes</small>
                </div>

                <button type="submit" className="btn-submit">
                  ✓ Guardar Palabra
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
            <p>Cargando palabras...</p>
          </div>
        )}

        {!loading && selectedTopic && words.length === 0 && (
          <div className="no-words">
            <p>📚 No hay palabras registradas para este tema.</p>
            <p className="hint">Agrega la primera palabra usando el botón de arriba.</p>
          </div>
        )}

        {!loading && words.length > 0 && (
          <div className="words-list">
            <h2>Palabras Registradas ({words.length})</h2>
            <div className="words-grid">
              {words.map((word) => (
                <div key={word._id} className="word-card">
                  {editingId === word._id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Categoría</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Palabra</label>
                        <input
                          type="text"
                          value={editWord}
                          onChange={(e) => setEditWord(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Pista</label>
                        <textarea
                          value={editHint}
                          onChange={(e) => setEditHint(e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="edit-actions">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdateWord(word._id)}
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
                      <div className="word-header">
                        <span className="word-category">{formatTitle(word.title)}</span>
                        <span className="word-text">{word.word}</span>
                      </div>
                      {word.hint && (
                        <div className="word-hint">
                          <span className="hint-icon">💡</span>
                          <span>{word.hint}</span>
                        </div>
                      )}
                      <div className="word-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(word)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteWord(word._id)}
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

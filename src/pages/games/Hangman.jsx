import './Hangman.css';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import HangmanDisplay from '../../components/HangmanDisplay';

export default function Hangman() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [title, setTitle] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [allWords, setAllWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Estado del formulario
  const [newWord, setNewWord] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newHint, setNewHint] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    axios.get('/topics')
      .then(res => setTopics(res.data))
      .catch(err => console.error('Error al cargar temas', err));
  }, []);

  const fetchWords = async (topic_id) => {
    setLoading(true);
    setWord('');
    setTitle('');
    setHint('');
    
    try {
      const res = await axios.get(`/hangman?topic_id=${topic_id}`);
      const items = res.data;
      
      if (items.length > 0) {
        // Mezclar palabras
        const shuffled = items.sort(() => Math.random() - 0.5);
        setAllWords(shuffled);
        setCurrentWordIndex(0);
        loadWord(shuffled, 0);
      } else {
        setAllWords([]);
        setMessage('No hay palabras registradas para este tema.');
      }
    } catch (err) {
      console.error('Error al cargar palabras:', err);
      setMessage('Error al cargar las palabras');
    } finally {
      setLoading(false);
    }
  };

  const loadWord = (words, index) => {
    if (words && words[index]) {
      setWord(words[index].word.toUpperCase());
      setTitle(words[index].title);
      setHint(words[index].hint || '');
    }
  };

  const handleChange = (e) => {
    const topic_id = e.target.value;
    setSelectedTopic(topic_id);
    if (topic_id) {
      fetchWords(topic_id);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('hangman_game');
    if (allWords.length > 0) {
      // Siguiente palabra
      const nextIndex = (currentWordIndex + 1) % allWords.length;
      setCurrentWordIndex(nextIndex);
      loadWord(allWords, nextIndex);
    }
  };

  const formatTitle = (str) =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const handleAddWord = async (e) => {
    e.preventDefault();

    if (!newWord.trim() || !newTitle.trim() || !selectedTopic) {
      return setMessage('Completa todos los campos obligatorios.');
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
      
      // Recargar palabras
      fetchWords(selectedTopic);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error al agregar la palabra.');
    }
  };

  return (
    <div className="hangman-page">
      <button className="back-button" onClick={() => navigate('/games')}>
        ← Volver a Juegos
      </button>

      <div className="hangman-container">
        <div className="hangman-header">
          <h1>🎯 Juego del Ahorcado</h1>
          <p className="subtitle">Adivina la palabra relacionada con ciberseguridad</p>
        </div>

        <div className="topic-selector">
          <label>📚 Selecciona un tema:</label>
          <select value={selectedTopic} onChange={handleChange}>
            <option value="">-- Selecciona un tema --</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.topic_name}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Cargando palabras...</p>
          </div>
        )}

        {!loading && word && (
          <div className="game-area">
            <div className="category-badge">
              <span className="badge-icon">🏷️</span>
              <span className="badge-text">{formatTitle(title)}</span>
            </div>

            {hint && (
              <div className="hint-box">
                <span className="hint-icon">💡</span>
                <span className="hint-text">{hint}</span>
              </div>
            )}

            <HangmanDisplay 
              word={word} 
              onRestart={handleRestart}
              hint={hint}
            />

            {allWords.length > 1 && (
              <div className="word-counter">
                Palabra {currentWordIndex + 1} de {allWords.length}
              </div>
            )}
          </div>
        )}

        {!loading && selectedTopic && !word && (
          <div className="no-words-message">
            <p>📚 No hay palabras registradas para este tema.</p>
            {user?.role === 'docente' && (
              <p className="hint-text">Agrega la primera palabra usando el formulario de abajo.</p>
            )}
          </div>
        )}

        {user?.role === 'docente' && selectedTopic && (
          <div className="teacher-section">
            <button
              className="btn-toggle-form"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✖ Cancelar' : '+ Agregar Nueva Palabra'}
            </button>

            {showAddForm && (
              <form className="add-word-form" onSubmit={handleAddWord}>
                <h3>Nueva Palabra</h3>

                <div className="form-group">
                  <label>Categoría (título interno) *</label>
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
                
                {message && (
                  <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

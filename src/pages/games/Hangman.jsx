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

  return (
    <div className="hangman-page">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Volver a Juegos
        </button>
        {user?.role === 'docente' && (
          <button className="manage-button" onClick={() => navigate('/manage-hangman')}>
            ⚙️ Gestionar Palabras
          </button>
        )}
      </div>

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
              <p className="hint-text">
                <button className="btn-manage-link" onClick={() => navigate('/manage-hangman')}>
                  Haz click aquí para agregar palabras
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

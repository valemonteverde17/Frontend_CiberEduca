import './Hangman.css'; // mantiene estilos generales
import '../create-quizzes.css'; // reutiliza estilos del formulario

import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import HangmanDisplay from '../../components/HangmanDisplay';

export default function Hangman() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // estado del formulario
  const [newWord, setNewWord] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    axios.get('/topics')
      .then(res => setTopics(res.data))
      .catch(err => console.error('Error al cargar temas', err));
  }, []);

  const fetchWord = (topic_id) => {
    setLoading(true);
    setWord('');
    setTitle('');
    axios.get(`/hangman?topic_id=${topic_id}`)
      .then(res => {
        const items = res.data;
        if (items.length > 0) {
          const random = Math.floor(Math.random() * items.length);
          setWord(items[random].word.toUpperCase());
          setTitle(items[random].title);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const topic_id = e.target.value;
    setSelectedTopic(topic_id);
    fetchWord(topic_id);
  };

  const handleRestart = () => {
    localStorage.removeItem('hangman_game');
    if (selectedTopic) {
      fetchWord(selectedTopic);
    }
  };

  const formatTitle = (str) =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const handleAddWord = async (e) => {
    e.preventDefault();

    if (!newWord.trim() || !newTitle.trim() || !selectedTopic) {
      return setMessage('Completa todos los campos para agregar una palabra.');
    }

    try {
      await axios.post('/hangman', {
        word: newWord.toUpperCase(),
        title: newTitle.toLowerCase().replace(/\s+/g, '_'),
        topic_id: selectedTopic,
        user_id: user._id
      });

      setMessage('Palabra agregada correctamente.');
      setNewWord('');
      setNewTitle('');
    } catch (err) {
      console.error(err);
      setMessage('Error al agregar la palabra.');
    }
  };

  return (
    <div className="hangman-page">
      <div className="hangman-inner">
        <h1>Juego de Ahorcados</h1>

        <label>Selecciona un tema:</label>
        <select value={selectedTopic} onChange={handleChange}>
          <option value="">-- Tema --</option>
          {topics.map(t => (
            <option key={t._id} value={t._id}>{t.topic_name}</option>
          ))}
        </select>

        {loading && <p>Cargando palabra...</p>}
        {!loading && word && (
          <>
            <h2>Categoría: {formatTitle(title)}</h2>
            <HangmanDisplay word={word} onRestart={handleRestart} />
          </>
        )}

        {!loading && selectedTopic && !word && (
          <p>No hay palabras registradas para este tema.</p>
        )}

        {user?.role === 'docente' && (
          <form className="create-quiz-form" onSubmit={handleAddWord} style={{ marginTop: '2rem' }}>
            <h2>Agregar nueva palabra</h2>

            <label>Categoría (título interno):</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej: vpn_seguro"
              required
            />

            <label>Palabra:</label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Ej: Encriptado"
              required
            />

            <button type="submit" className="submit-quiz-button">Guardar palabra</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
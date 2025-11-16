import './Memorama.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Memorama() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estado del juego
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [wrongMatch, setWrongMatch] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para agregar pares (docentes)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('easy');
  const [message, setMessage] = useState('');

  // Cargar temas al inicio
  useEffect(() => {
    axios.get('/topics')
      .then(res => setTopics(res.data))
      .catch(err => console.error('Error al cargar temas', err));
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  // Cargar pares del tema seleccionado
  const loadGame = async (topicId, diff) => {
    setLoading(true);
    try {
      const res = await axios.get(`/memorama/topic/${topicId}?difficulty=${diff}`);
      const pairs = res.data;

      if (pairs.length < 3) {
        alert('Se necesitan al menos 3 pares para jugar. Agrega más conceptos.');
        setLoading(false);
        return;
      }

      // Seleccionar pares aleatorios según dificultad
      const numPairs = diff === 'easy' ? 5 : diff === 'medium' ? 7 : 10;
      const selectedPairs = pairs.sort(() => Math.random() - 0.5).slice(0, Math.min(numPairs, pairs.length));

      // Crear cartas
      const gameCards = selectedPairs.flatMap(pair => [
        { id: pair._id, content: pair.concept, type: 'concept', pairId: pair._id },
        { id: pair._id + '_def', content: pair.definition, type: 'definition', pairId: pair._id }
      ]);

      // Mezclar
      const shuffled = gameCards.sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setShowAll(true);
      setTimeout(() => {
        setShowAll(false);
        setIsPlaying(true);
      }, 3000);
    } catch (err) {
      console.error('Error al cargar el juego:', err);
      alert('Error al cargar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    resetGame();
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    resetGame();
  };

  const startGame = () => {
    if (!selectedTopic) {
      alert('Selecciona un tema primero');
      return;
    }
    resetGame();
    loadGame(selectedTopic, difficulty);
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameWon(false);
    setMoves(0);
    setTimer(0);
    setIsPlaying(false);
    setShowAll(false);
  };

  const handleFlip = (index) => {
    if (
      flippedCards.includes(index) ||
      matchedPairs.includes(cards[index].pairId) ||
      flippedCards.length === 2 ||
      showAll
    ) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match correcto
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setFlippedCards([]);

        // Verificar si ganó
        if (matchedPairs.length + 1 === cards.length / 2) {
          setGameWon(true);
          setIsPlaying(false);
        }
      } else {
        // Match incorrecto
        setWrongMatch(true);
        setTimeout(() => {
          setWrongMatch(false);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleAddPair = async (e) => {
    e.preventDefault();
    if (!newConcept.trim() || !newDefinition.trim() || !selectedTopic) {
      setMessage('Completa todos los campos');
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

      setMessage('Par agregado correctamente');
      setNewConcept('');
      setNewDefinition('');
      setShowAddForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error al agregar el par');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStars = () => {
    if (moves <= cards.length) return 3;
    if (moves <= cards.length * 1.5) return 2;
    return 1;
  };

  return (
    <div className="memorama-page">
      <button className="back-button" onClick={() => navigate('/games')}>
        ← Volver a Juegos
      </button>

      <div className="memorama-header">
        <h1>🧠 Memorama de Ciberseguridad</h1>
        <p className="subtitle">Encuentra los pares de conceptos y definiciones</p>
      </div>

      <div className="game-controls">
        <div className="control-group">
          <label>📚 Tema:</label>
          <select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">-- Selecciona un tema --</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.topic_name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>⚡ Dificultad:</label>
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Fácil (5 pares)</option>
            <option value="medium">Medio (7 pares)</option>
            <option value="hard">Difícil (10 pares)</option>
          </select>
        </div>

        <button className="btn-start-game" onClick={startGame} disabled={!selectedTopic || loading}>
          {loading ? 'Cargando...' : cards.length > 0 ? '🔄 Reiniciar' : '🎮 Iniciar Juego'}
        </button>
      </div>

      {isPlaying && (
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">⏱️ Tiempo:</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">🎯 Movimientos:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">✅ Pares:</span>
            <span className="stat-value">{matchedPairs.length} / {cards.length / 2}</span>
          </div>
        </div>
      )}

      {cards.length > 0 && (
        <div className={`memorama-grid difficulty-${difficulty}`}>
          {cards.map((card, index) => (
            <div
              key={index}
              className={`memory-card ${
                flippedCards.includes(index) || matchedPairs.includes(card.pairId) || showAll ? 'flipped' : ''
              } ${wrongMatch && flippedCards.includes(index) ? 'shake' : ''} ${
                matchedPairs.includes(card.pairId) ? 'matched' : ''
              }`}
              onClick={() => handleFlip(index)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-icon">🔒</span>
                </div>
                <div className={`card-back ${card.type}`}>
                  <span className="card-text">{card.content}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {gameWon && (
        <div className="win-modal">
          <div className="win-content">
            <h2>🎉 ¡Felicidades! 🎉</h2>
            <p className="win-message">Has completado el memorama</p>
            <div className="win-stats">
              <div className="win-stat">
                <span className="win-stat-label">Tiempo:</span>
                <span className="win-stat-value">{formatTime(timer)}</span>
              </div>
              <div className="win-stat">
                <span className="win-stat-label">Movimientos:</span>
                <span className="win-stat-value">{moves}</span>
              </div>
              <div className="stars">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={i < getStars() ? 'star filled' : 'star'}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            <div className="win-actions">
              <button className="btn-play-again" onClick={startGame}>
                🔄 Jugar de Nuevo
              </button>
              <button className="btn-next-level" onClick={() => {
                if (difficulty === 'easy') setDifficulty('medium');
                else if (difficulty === 'medium') setDifficulty('hard');
                resetGame();
              }}>
                ⬆️ Siguiente Nivel
              </button>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'docente' && selectedTopic && (
        <div className="teacher-section">
          <button
            className="btn-toggle-form"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✖ Cancelar' : '+ Agregar Par de Conceptos'}
          </button>

          {showAddForm && (
            <form className="add-pair-form" onSubmit={handleAddPair}>
              <h3>Nuevo Par de Conceptos</h3>
              
              <div className="form-group">
                <label>Concepto:</label>
                <input
                  type="text"
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder="Ej: Phishing"
                  required
                />
              </div>

              <div className="form-group">
                <label>Definición:</label>
                <textarea
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Ej: Estafa digital mediante correos falsos"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dificultad:</label>
                <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)}>
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <button type="submit" className="btn-submit">
                ✓ Guardar Par
              </button>
              {message && <p className="message">{message}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

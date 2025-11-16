import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Rankings.css';

export default function Rankings() {
  const navigate = useNavigate();
  
  const [view, setView] = useState('global'); // 'global' o 'quiz'
  const [globalRanking, setGlobalRanking] = useState([]);
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuizSet, setSelectedQuizSet] = useState('');
  const [quizRanking, setQuizRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGlobalRanking();
    loadQuizSets();
  }, []);

  const loadGlobalRanking = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/scores/ranking/global');
      console.log('Ranking global recibido:', res.data);
      setGlobalRanking(res.data);
    } catch (err) {
      console.error('Error al cargar ranking global:', err);
      console.error('Detalles del error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizSets = async () => {
    try {
      const res = await axios.get('/quiz-sets');
      console.log('Quiz sets recibidos:', res.data);
      setQuizSets(res.data);
    } catch (err) {
      console.error('Error al cargar quiz sets:', err);
    }
  };

  const loadQuizRanking = async (quizSetId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/scores/ranking/quiz-set/${quizSetId}`);
      setQuizRanking(res.data);
    } catch (err) {
      console.error('Error al cargar ranking del quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSetChange = (e) => {
    const quizSetId = e.target.value;
    setSelectedQuizSet(quizSetId);
    if (quizSetId) {
      loadQuizRanking(quizSetId);
    }
  };

  const getMedalIcon = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  const getMedalClass = (position) => {
    if (position === 0) return 'gold';
    if (position === 1) return 'silver';
    if (position === 2) return 'bronze';
    return '';
  };

  return (
    <div className="rankings-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="rankings-container">
        <div className="rankings-header">
          <h1>🏆 Rankings</h1>
          <p className="subtitle">Compite y alcanza la cima</p>
        </div>

        {/* Selector de vista */}
        <div className="view-selector">
          <button
            className={`view-btn ${view === 'global' ? 'active' : ''}`}
            onClick={() => setView('global')}
          >
            🌍 Ranking Global
          </button>
          <button
            className={`view-btn ${view === 'quiz' ? 'active' : ''}`}
            onClick={() => setView('quiz')}
          >
            📝 Por Quiz
          </button>
        </div>

        {/* Ranking Global */}
        {view === 'global' && (
          <div className="ranking-section">
            <div className="section-header">
              <h2>🌍 Ranking Global</h2>
              <p>Basado en la suma total de puntajes</p>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Cargando ranking...</p>
              </div>
            ) : globalRanking.length === 0 ? (
              <div className="no-data">
                <p>📊 Aún no hay datos de ranking.</p>
                <p className="hint">¡Sé el primero en completar un quiz!</p>
              </div>
            ) : (
              <div className="ranking-list">
                {globalRanking.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`ranking-card ${getMedalClass(index)}`}
                  >
                    <div className="ranking-position">
                      <span className="medal">{getMedalIcon(index)}</span>
                    </div>
                    <div className="ranking-info">
                      <h3>{entry.user_name}</h3>
                      <div className="ranking-stats">
                        <span className="stat">
                          <span className="stat-icon">⭐</span>
                          {entry.total_score} pts
                        </span>
                        <span className="stat">
                          <span className="stat-icon">📝</span>
                          {entry.quizzes_completed} quizzes
                        </span>
                        <span className="stat">
                          <span className="stat-icon">📊</span>
                          {entry.average_score}% promedio
                        </span>
                      </div>
                    </div>
                    <div className="ranking-score">
                      <div className="score-value">{entry.total_score}</div>
                      <div className="score-label">puntos</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ranking por Quiz */}
        {view === 'quiz' && (
          <div className="ranking-section">
            <div className="section-header">
              <h2>📝 Ranking por Quiz</h2>
              <p>Selecciona un quiz para ver su ranking</p>
            </div>

            <div className="quiz-selector">
              <label>Selecciona un Quiz:</label>
              <select value={selectedQuizSet} onChange={handleQuizSetChange}>
                <option value="">-- Selecciona un quiz --</option>
                {quizSets.map((qs) => (
                  <option key={qs._id} value={qs._id}>
                    {qs.quiz_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedQuizSet && (
              <>
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando ranking...</p>
                  </div>
                ) : quizRanking.length === 0 ? (
                  <div className="no-data">
                    <p>📊 Aún no hay puntajes para este quiz.</p>
                  </div>
                ) : (
                  <div className="ranking-list">
                    {quizRanking.map((entry, index) => (
                      <div
                        key={entry._id}
                        className={`ranking-card ${getMedalClass(index)}`}
                      >
                        <div className="ranking-position">
                          <span className="medal">{getMedalIcon(index)}</span>
                        </div>
                        <div className="ranking-info">
                          <h3>{entry.user_id?.user_name || 'Usuario'}</h3>
                          <div className="ranking-stats">
                            <span className="stat">
                              <span className="stat-icon">✅</span>
                              {entry.correct_answers}/{entry.total_questions} correctas
                            </span>
                            <span className="stat">
                              <span className="stat-icon">⏱️</span>
                              {Math.floor(entry.time_taken / 60)}m {entry.time_taken % 60}s
                            </span>
                          </div>
                        </div>
                        <div className="ranking-score">
                          <div className="score-value">{entry.score}%</div>
                          <div className="score-label">puntaje</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

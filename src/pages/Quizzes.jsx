import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResultTable from '../components/ResultTable';
import './Quizzes.css';

export default function Quizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicName, setSelectedTopicName] = useState('');
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuizSet, setSelectedQuizSet] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    axios.get('/topics').then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    const fetchQuizSets = async () => {
      try {
        const quizSetsRes = await axios.get(`/quiz-sets/topic/${selectedTopic}`);
        setQuizSets(quizSetsRes.data);
        setSelectedQuizSet(null);
        setQuizzes([]);
        setAnswers({});
        setFeedback({});
        setScore(null);
        setShowResults(false);
      } catch (err) {
        console.error('Error al cargar cuestionarios:', err);
      }
    };

    if (selectedTopic) fetchQuizSets();
  }, [selectedTopic]);

  const startQuizSet = async (quizSet) => {
    try {
      setSelectedQuizSet(quizSet);
      const quizzesRes = await axios.get(`/quizzes/quiz-set/${quizSet._id}`);
      setQuizzes(quizzesRes.data);
      setAnswers({});
      setFeedback({});
      setScore(null);
      setShowResults(false);
      setStartTime(Date.now()); // Iniciar timer

      if (user.role === 'estudiante') {
        const resultsRes = await axios.get(`/results/by-topic/${user._id}/${selectedTopic}`);
        const results = resultsRes.data;

        const savedAnswers = {};
        const savedFeedback = {};
        results.forEach(r => {
          savedAnswers[r.quiz_id] = r.selectedAnswer;
          savedFeedback[r.quiz_id] = r.isCorrect;
        });

        setAnswers(savedAnswers);
        setFeedback(savedFeedback);
      }
    } catch (err) {
      console.error('Error al cargar preguntas:', err);
    }
  };

  const handleSelect = (quizId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [quizId]: selectedOption }));
  };

  const confirmAnswers = async () => {
    if (Object.keys(answers).length !== quizzes.length) {
      alert('Por favor responde todas las preguntas antes de confirmar.');
      return;
    }

    const newFeedback = {};
    let correct = 0;

    for (const quiz of quizzes) {
      const isCorrect = quiz.correctAnswer === answers[quiz._id];
      newFeedback[quiz._id] = isCorrect;
      if (isCorrect) correct++;

      if (user.role === 'estudiante') {
        try {
          await axios.post('/results', {
            user_id: user._id,
            quiz_id: quiz._id,
            selectedAnswer: answers[quiz._id],
            isCorrect
          });
        } catch (err) {
          console.error('Error al guardar resultado:', err);
        }
      }
    }

    setFeedback(newFeedback);
    const finalScore = Math.round((correct / quizzes.length) * 100);
    setScore({ total: quizzes.length, correct, percentage: finalScore });
    setShowResults(true);

    // Guardar score si es estudiante
    if (user.role === 'estudiante' && selectedQuizSet) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Tiempo en segundos
      
      try {
        await axios.post('/scores', {
          user_id: user._id,
          quiz_set_id: selectedQuizSet._id,
          topic_id: selectedTopic,
          score: finalScore,
          total_questions: quizzes.length,
          correct_answers: correct,
          time_taken: timeTaken,
        });
      } catch (err) {
        console.error('Error al guardar score:', err);
      }
    }
  };

  const resetQuiz = () => {
    setSelectedQuizSet(null);
    setQuizzes([]);
    setAnswers({});
    setFeedback({});
    setScore(null);
    setShowResults(false);
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    const topic = topics.find(t => t._id === topicId);
    setSelectedTopicName(topic ? topic.topic_name : '');
  };

  return (
    <div className="quizzes-container">
      <div className="quizzes-header-section">
        <div>
          <h2 className="quizzes-title">
            {user.role === 'docente' ? 'Gestión de Evaluaciones' : 'Evaluaciones'}
          </h2>
          {selectedTopicName && (
            <p className="selected-topic-name">📚 {selectedTopicName}</p>
          )}
        </div>
        {user.role === 'docente' && selectedTopic && (
          <button onClick={() => navigate('/crear-quiz')} className="btn-add-quiz">
            + Agregar Cuestionario
          </button>
        )}
      </div>

      <div className="topic-selector">
        <label htmlFor="topic-select">Selecciona un tema:</label>
        <select
          id="topic-select"
          className="topic-select"
          value={selectedTopic}
          onChange={handleTopicChange}
        >
          <option value="">-- Elige un tema --</option>
          {topics.map(topic => (
            <option key={topic._id} value={topic._id}>
              {topic.topic_name}
            </option>
          ))}
        </select>
      </div>

      {selectedTopic && !selectedQuizSet && (
        <div className="quiz-sets-section">
          <h3 className="quiz-sets-title">📋 Cuestionarios Disponibles</h3>
          
          {quizSets.length === 0 ? (
            <div className="no-quizzes-message">
              <p>📚 No hay cuestionarios disponibles para este tema.</p>
              {user.role === 'docente' && (
                <button onClick={() => navigate('/crear-quiz')} className="btn-create-first">
                  Crear primer cuestionario
                </button>
              )}
            </div>
          ) : (
            <div className="quiz-sets-grid">
              {quizSets.map(quizSet => (
                <div key={quizSet._id} className="quiz-set-card">
                  <div className="quiz-set-header">
                    <h4>{quizSet.quiz_name}</h4>
                    {quizSet.isActive && <span className="active-badge">✓ Activo</span>}
                  </div>
                  {quizSet.description && (
                    <p className="quiz-set-description">{quizSet.description}</p>
                  )}
                  <button 
                    onClick={() => startQuizSet(quizSet)} 
                    className="btn-start-quiz"
                  >
                    {user.role === 'docente' ? 'Ver Preguntas' : 'Iniciar Cuestionario'} →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedQuizSet && quizzes.length > 0 && (
        <div className="quizzes-content">
          <div className="quiz-progress">
            <span>Pregunta {Object.keys(feedback).length} de {quizzes.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(Object.keys(feedback).length / quizzes.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="quizzes-list">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz._id}
                className={`quiz-card ${feedback[quiz._id] === true ? 'correct' : feedback[quiz._id] === false ? 'incorrect' : ''}`}
              >
                <div className="quiz-header">
                  <span className="quiz-number">Pregunta {index + 1}</span>
                  {feedback[quiz._id] !== undefined && (
                    <span className={`quiz-status ${feedback[quiz._id] ? 'status-correct' : 'status-incorrect'}`}>
                      {feedback[quiz._id] ? '✓ Correcta' : '✗ Incorrecta'}
                    </span>
                  )}
                </div>
                <p className="quiz-question">{quiz.question}</p>
                <div className="quiz-options-grid">
                  {quiz.options.map((option, idx) => (
                    <label
                      key={option}
                      className={`quiz-option-label ${
                        answers[quiz._id] === option ? 'selected' : ''
                      } ${
                        feedback[quiz._id] !== undefined && option === quiz.correctAnswer ? 'correct-answer' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${quiz._id}`}
                        value={option}
                        checked={answers[quiz._id] === option}
                        onChange={() => handleSelect(quiz._id, option)}
                        disabled={feedback[quiz._id] !== undefined || user.role !== 'estudiante'}
                      />
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedQuizSet && !showResults && user.role === 'estudiante' && (
        <div className="confirm-section">
          <button className="btn-confirm-answer" onClick={confirmAnswers}>
            ✓ Confirmar Todas las Respuestas
          </button>
        </div>
      )}

      {selectedQuizSet && (
        <div className="confirm-section">
          <button className="btn-back-to-sets" onClick={resetQuiz}>
            ← Volver a Cuestionarios
          </button>
        </div>
      )}

      {score && showResults && (
        <div className="final-score-card">
          <div className="score-icon">
            {score.correct / score.total >= 0.7 ? '🎉' : score.correct / score.total >= 0.5 ? '😊' : '💪'}
          </div>
          <h3>Evaluación Completada</h3>
          <div className="score-display">
            <span className="score-number">{score.correct}</span>
            <span className="score-separator">/</span>
            <span className="score-total">{score.total}</span>
          </div>
          <p className="score-percentage">
            {Math.round((score.correct / score.total) * 100)}% de respuestas correctas
          </p>
          <div className="score-message">
            {score.correct / score.total >= 0.7 ? '¡Excelente trabajo!' : 
             score.correct / score.total >= 0.5 ? '¡Buen esfuerzo! Sigue practicando.' : 
             '¡No te rindas! Revisa el material y vuelve a intentarlo.'}
          </div>
        </div>
      )}

      {selectedTopic && user.role === 'estudiante' && (
        <div className="results-section">
          <h3 className="results-title">📊 Mi Historial de Evaluaciones</h3>
          <div className="results-container">
            <div className="table-wrapper">
              <ResultTable topicId={selectedTopic} />
            </div>
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={() => window.location.href = '/rankings'} 
              className="btn-view-rankings"
            >
              🏆 Ver Rankings Globales
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

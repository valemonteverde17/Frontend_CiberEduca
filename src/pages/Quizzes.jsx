import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResultTable from '../components/ResultTable';
import GlobalRanking from '../components/GlobalRanking';
import './Quizzes.css';

export default function Quizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicName, setSelectedTopicName] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    axios.get('/topics').then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    const fetchQuizzesAndResults = async () => {
      try {
        const quizzesRes = await axios.get(`/quizzes/topic/${selectedTopic}`);
        setQuizzes(quizzesRes.data);
        setAnswers({});
        setFeedback({});
        setScore(null);
        setPendingConfirm(null);
        setShowResults(false);

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
        console.error('Error al cargar quizzes:', err);
      }
    };

    if (selectedTopic) fetchQuizzesAndResults();
  }, [selectedTopic, user]);

  const handleSelect = (quizId, selectedOption) => {
    setPendingConfirm({ quizId, selectedOption });
  };

  const confirmAnswer = async () => {
    if (!pendingConfirm) return;

    const { quizId, selectedOption } = pendingConfirm;
    const quiz = quizzes.find(q => q._id === quizId);
    const isCorrect = quiz.correctAnswer === selectedOption;

    setAnswers(prev => ({ ...prev, [quizId]: selectedOption }));
    setFeedback(prev => ({ ...prev, [quizId]: isCorrect }));
    setPendingConfirm(null);

    try {
      if (user.role !== 'estudiante') return alert('Solo los estudiantes pueden responder');

      await axios.post('/results', {
        user_id: user._id,
        quiz_id: quizId,
        selectedAnswer: selectedOption,
        isCorrect
      });
    } catch (err) {
      console.error('Error al guardar resultado:', err);
    }

    const currentFeedback = { ...feedback, [quizId]: isCorrect };
    const allAnswered = quizzes.every(q => currentFeedback[q._id] !== undefined);

    if (allAnswered) {
      const correct = quizzes.filter(q => currentFeedback[q._id] === true).length;
      setScore({ total: quizzes.length, correct });
      setShowResults(true);
    }
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
            + Agregar Pregunta
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

      {quizzes.length === 0 && selectedTopic && (
        <div className="no-quizzes-message">
          <p>📚 No hay preguntas disponibles para este tema.</p>
          {user.role === 'docente' && (
            <button onClick={() => navigate('/crear-quiz')} className="btn-create-first">
              Crear primera pregunta
            </button>
          )}
        </div>
      )}

      {quizzes.length > 0 && (
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
                        (pendingConfirm?.quizId === quiz._id && pendingConfirm.selectedOption === option) || 
                        answers[quiz._id] === option ? 'selected' : ''
                      } ${
                        feedback[quiz._id] !== undefined && option === quiz.correctAnswer ? 'correct-answer' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${quiz._id}`}
                        value={option}
                        checked={(pendingConfirm?.quizId === quiz._id && pendingConfirm.selectedOption === option) || answers[quiz._id] === option}
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

      {pendingConfirm && user.role === 'estudiante' && (
        <div className="confirm-section">
          <button className="btn-confirm-answer" onClick={confirmAnswer}>
            ✓ Confirmar Respuesta
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
          <h3 className="results-title">Estadísticas y Rankings</h3>
          <div className="results-container">
            <div className="table-wrapper">
              <ResultTable topicId={selectedTopic} />
            </div>
            <div className="table-wrapper">
              <GlobalRanking topicId={selectedTopic} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

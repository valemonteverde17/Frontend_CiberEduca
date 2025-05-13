import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResultTable from '../components/ResultTable';
import GlobalRanking from '../components/GlobalRanking';
import './quizzes.css';

export default function Quizzes() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);
  const [pendingConfirm, setPendingConfirm] = useState(null);

  useEffect(() => {
    axios.get('/topics').then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    const fetchQuizzesAndResults = async () => {
      const quizzesRes = await axios.get(`/quizzes/topic/${selectedTopic}`);
      setQuizzes(quizzesRes.data);
      setAnswers({});
      setFeedback({});
      setScore(null);
      setPendingConfirm(null);

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
    };

    if (selectedTopic) fetchQuizzesAndResults();
  }, [selectedTopic]);

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
    }
  };

  return (
    <div className="quizzes-container">
      <h2 className="quizzes-title">Quizzes</h2>

      <div className="select-label">
        <label htmlFor="topic-select">Tema:</label>
        <select
          id="topic-select"
          className="topic-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {topics.map(topic => (
            <option key={topic._id} value={topic._id}>
              {topic.topic_name}
            </option>
          ))}
        </select>

        {user.role === 'docente' && (
          <button onClick={() => window.location.href = '/crear-quiz'} className="add-quiz-button">
            ➕ Agregar Quiz
          </button>
        )}
      </div>

      {quizzes.length === 0 && selectedTopic && (
        <p style={{ textAlign: 'center' }}>No hay quizzes para este tema.</p>
      )}

      {quizzes.map(quiz => (
        <div
          key={quiz._id}
          className={`quiz-box ${feedback[quiz._id] === true ? 'correct' : feedback[quiz._id] === false ? 'incorrect' : ''}`}
        >
          <p><strong>{quiz.question}</strong></p>
          {quiz.options.map(option => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name={`quiz-${quiz._id}`}
                  value={option}
                  checked={pendingConfirm?.quizId === quiz._id && pendingConfirm.selectedOption === option || answers[quiz._id] === option}
                  onChange={() => handleSelect(quiz._id, option)}
                  disabled={feedback[quiz._id] !== undefined}
                />
                {' '}{option}
              </label>
            </div>
          ))}
          {feedback[quiz._id] !== undefined && (
            <p>{feedback[quiz._id] ? '✅ Correcto' : '❌ Incorrecto'}</p>
          )}
        </div>
      ))}

      {pendingConfirm && (
        <button className="confirm-button" onClick={confirmAnswer}>
          Confirmar respuesta
        </button>
      )}

      {score && (
        <div className="result-final">
          <h3>Resultado final</h3>
          <p>
            Has respondido <strong>{score.correct}</strong> de <strong>{score.total}</strong> preguntas correctamente.
          </p>
        </div>
      )}

      <div className="results-container">
        <div className="table-wrapper">
          <ResultTable topicId={selectedTopic} />
        </div>
        <div className="table-wrapper">
          <GlobalRanking topicId={selectedTopic} />
        </div>
      </div>
    </div>
  );
}

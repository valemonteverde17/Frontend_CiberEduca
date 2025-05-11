import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResultTable from '../components/ResultTable';
import GlobalRanking from '../components/GlobalRanking';

export default function Quizzes() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get('/topics').then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      axios.get(`/quizzes/topic/${selectedTopic}`).then(res => {
        setQuizzes(res.data);
        setAnswers({});
        setFeedback({});
        setScore(null);
      });
    }
  }, [selectedTopic]);

  const handleAnswer = async (quizId, selectedOption) => {
    const quiz = quizzes.find(q => q._id === quizId);
    const isCorrect = quiz.correctAnswer === selectedOption;

    setAnswers(prev => ({ ...prev, [quizId]: selectedOption }));
    setFeedback(prev => ({ ...prev, [quizId]: isCorrect }));

    try {
      await axios.post('/results', {
        user_id: user._id,
        quiz_id: quizId,
        selectedAnswer: selectedOption,
        isCorrect
      });
    } catch (err) {
      console.error('Error al guardar resultado:', err);
    }

    const allAnswered = quizzes.every(q => answers[q._id] || q._id === quizId);
    if (allAnswered) {
      const res = await axios.get(`/results/score/${user._id}/${selectedTopic}`);
      setScore(res.data);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Quizzes Interactivos</h2>

      <label htmlFor="topic-select">Selecciona un tema:</label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        style={{ marginLeft: '1rem' }}
      >
        <option value="">-- Selecciona --</option>
        {topics.map(topic => (
          <option key={topic._id} value={topic._id}>
            {topic.topic_name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '2rem' }}>
        {quizzes.length === 0 && selectedTopic && <p>No hay quizzes para este tema.</p>}
        {quizzes.map(quiz => (
          <div
            key={quiz._id}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: feedback[quiz._id] === true
                ? '#d4edda'
                : feedback[quiz._id] === false
                ? '#f8d7da'
                : '#fff'
            }}
          >
            <p><strong>{quiz.question}</strong></p>
            {quiz.options.map(option => (
              <div key={option}>
                <label>
                  <input
                    type="radio"
                    name={`quiz-${quiz._id}`}
                    value={option}
                    checked={answers[quiz._id] === option}
                    onChange={() => handleAnswer(quiz._id, option)}
                  />
                  {' '}
                  {option}
                </label>
              </div>
            ))}
            {feedback[quiz._id] !== undefined && (
              <p>
                {feedback[quiz._id] ? '✅ Correcto' : '❌ Incorrecto'}
              </p>
            )}
          </div>
        ))}
      </div>

      {score && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e2e3e5', borderRadius: '8px' }}>
          <h3>Resultado final</h3>
          <p>
            Has respondido <strong>{score.correct}</strong> de <strong>{score.total}</strong> preguntas correctamente.
          </p>
        </div>
      )}

      {/* ✅ Historial y ranking al final */}
      <ResultTable />
      <GlobalRanking />
    </div>
  );
}

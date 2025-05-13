import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from '../api/axios';
import './create-quizzes.css';

const CreateQuizzes = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/topics')
      .then(res => setTopics(res.data))
      .catch(err => console.error('Error al cargar temas', err));
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'docente') return <Navigate to="/unauthorized" />;

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const addQuestion = (e) => {
    e.preventDefault();

    if (!question || options.some(o => o.trim() === '') || !correctAnswer || !selectedTopic) {
      return setMessage('Llena todos los campos correctamente para agregar la pregunta.');
    }

    const newQuestion = {
      question,
      options,
      correctAnswer,
      topic_id: selectedTopic
    };

    setQuestionsList([...questionsList, newQuestion]);

    // Limpiar campos
    setQuestion('');
    setOptions(['', '']);
    setCorrectAnswer('');
    setSelectedTopic('');
    setMessage('Pregunta añadida al quiz.');
  };

  const submitQuiz = async () => {
    if (questionsList.length === 0) return setMessage('Agrega al menos una pregunta.');

    try {
      for (const q of questionsList) {
        await axios.post('/quizzes', q);
      }
      setMessage('Quiz guardado exitosamente.');
      setQuestionsList([]);
    } catch (err) {
      console.error('Error al guardar el quiz', err);
      setMessage('Error al guardar el quiz.');
    }
  };

  return (
    <div className="create-quiz-container">
      <h1 className="create-quiz-title">Crear Quiz</h1>
      <form className="create-quiz-form" onSubmit={addQuestion}>
        
        <label>Tema:</label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          required
        >
          <option value="">--Selecciona un tema--</option>
          {topics.map(topic => (
            <option key={topic._id} value={topic._id}>
              {topic.topic_name}
            </option>
          ))}
        </select>

        <label>Pregunta:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe la pregunta"
          required
        />

        <label>Opciones:</label>
        {options.map((opt, index) => (
          <div className="option-input" key={index}>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, index)}
              placeholder={`Opción ${index + 1}`}
              required
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(index)}>Eliminar</button>
            )}
          </div>
        ))}
        <button type="button" className="add-option-button" onClick={addOption}>Agregar opción</button>

        <label>Respuesta correcta:</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
        >
          <option value="">--Selecciona una opción--</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || `Opción ${i + 1}`}
            </option>
          ))}
        </select>

        <button type="submit" className="add-question-button">Añadir Pregunta</button>
      </form>

      <div className="questions-list">
        <h2>Preguntas añadidas:</h2>
        <ul>
          {questionsList.map((q, idx) => (
            <li key={idx}>
              <strong>{q.question}</strong> ({q.options.length} opciones)
            </li>
          ))}
        </ul>
        {questionsList.length > 0 && (
          <button className="submit-quiz-button" onClick={submitQuiz}>Guardar Quiz</button>
        )}
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateQuizzes;

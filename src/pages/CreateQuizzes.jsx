import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './CreateQuizzes.css';

const CreateQuizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      setMessage('Por favor completa todos los campos correctamente.');
      setMessageType('error');
      return;
    }

    const newQuestion = {
      question,
      options: options.filter(o => o.trim() !== ''),
      correctAnswer,
      topic_id: selectedTopic
    };

    setQuestionsList([...questionsList, newQuestion]);

    // Limpiar campos
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setMessage('Pregunta añadida exitosamente.');
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const submitQuiz = async () => {
    if (questionsList.length === 0) {
      setMessage('Agrega al menos una pregunta.');
      setMessageType('error');
      return;
    }

    try {
      for (const q of questionsList) {
        await axios.post('/quizzes', q);
      }
      setMessage(`¡${questionsList.length} pregunta(s) guardada(s) exitosamente!`);
      setMessageType('success');
      setQuestionsList([]);
      setSelectedTopic('');
      
      setTimeout(() => {
        navigate('/quizzes');
      }, 2000);
    } catch (err) {
      console.error('Error al guardar el quiz', err);
      setMessage('Error al guardar las preguntas.');
      setMessageType('error');
    }
  };

  const removeQuestion = (index) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  return (
    <div className="create-quiz-container">
      <button className="back-button" onClick={() => navigate('/quizzes')}>
        ← Volver a Evaluaciones
      </button>

      <div className="create-quiz-header">
        <h1 className="create-quiz-title">Crear Preguntas de Evaluación</h1>
        <p className="create-quiz-subtitle">Agrega preguntas para evaluar el conocimiento de tus estudiantes</p>
      </div>

      {message && (
        <div className={`message-banner ${messageType}`}>
          {messageType === 'success' ? '✓' : '⚠'} {message}
        </div>
      )}

      <div className="create-quiz-content">
        <div className="form-section">
          <form className="create-quiz-form" onSubmit={addQuestion}>
            <div className="form-group">
              <label>Tema *</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                required
                className="form-select"
              >
                <option value="">-- Selecciona un tema --</option>
                {topics.map(topic => (
                  <option key={topic._id} value={topic._id}>
                    {topic.topic_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Pregunta *</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe la pregunta aquí..."
                required
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Opciones de Respuesta *</label>
              <div className="options-grid">
                {options.map((opt, index) => (
                  <div className="option-input-wrapper" key={index}>
                    <span className="option-label">{String.fromCharCode(65 + index)}</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(e.target.value, index)}
                      placeholder={`Opción ${index + 1}`}
                      required
                      className="option-input"
                    />
                    {options.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => removeOption(index)}
                        className="btn-remove-option"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button type="button" className="btn-add-option" onClick={addOption}>
                  + Agregar opción
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Respuesta Correcta *</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
                className="form-select"
              >
                <option value="">-- Selecciona la respuesta correcta --</option>
                {options.filter(o => o.trim()).map((opt, i) => (
                  <option key={i} value={opt}>
                    {String.fromCharCode(65 + i)}: {opt}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-add-question">
              ✓ Añadir Pregunta
            </button>
          </form>
        </div>

        <div className="questions-preview">
          <h2 className="preview-title">
            Preguntas Añadidas ({questionsList.length})
          </h2>
          
          {questionsList.length === 0 ? (
            <div className="empty-state">
              <p>📝 Aún no has añadido preguntas</p>
              <p className="hint">Completa el formulario para agregar tu primera pregunta</p>
            </div>
          ) : (
            <>
              <div className="questions-list">
                {questionsList.map((q, idx) => (
                  <div key={idx} className="question-preview-card">
                    <div className="question-preview-header">
                      <span className="question-number">Pregunta {idx + 1}</span>
                      <button 
                        onClick={() => removeQuestion(idx)}
                        className="btn-remove-question"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="question-preview-text">{q.question}</p>
                    <div className="question-preview-options">
                      {q.options.map((opt, i) => (
                        <div 
                          key={i} 
                          className={`preview-option ${opt === q.correctAnswer ? 'correct' : ''}`}
                        >
                          <span className="preview-option-letter">{String.fromCharCode(65 + i)}</span>
                          <span>{opt}</span>
                          {opt === q.correctAnswer && <span className="correct-badge">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-submit-quiz" onClick={submitQuiz}>
                💾 Guardar {questionsList.length} Pregunta(s)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizzes;

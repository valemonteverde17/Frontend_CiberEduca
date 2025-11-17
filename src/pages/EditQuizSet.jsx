import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './EditQuizSet.css';

export default function EditQuizSet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizSet, setQuizSet] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  // Nuevo quiz
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');

  useEffect(() => {
    loadQuizSet();
  }, [id]);

  const loadQuizSet = async () => {
    try {
      const quizSetRes = await axios.get(`/quiz-sets/${id}`);
      setQuizSet(quizSetRes.data);
      setQuizName(quizSetRes.data.quiz_name);
      setDescription(quizSetRes.data.description || '');
      setIsActive(quizSetRes.data.isActive);

      const quizzesRes = await axios.get(`/quizzes/quiz-set/${id}`);
      setQuizzes(quizzesRes.data);
    } catch (err) {
      console.error('Error al cargar cuestionario:', err);
      alert('Error al cargar el cuestionario');
    }
  };

  const handleUpdateQuizSet = async (e) => {
    e.preventDefault();
    if (!quizName) {
      alert('El nombre del cuestionario es obligatorio');
      return;
    }

    try {
      await axios.patch(`/quiz-sets/${id}`, {
        quiz_name: quizName,
        description,
        isActive
      });
      alert('Cuestionario actualizado exitosamente');
      loadQuizSet();
    } catch (err) {
      alert('Error al actualizar el cuestionario');
    }
  };

  const handleDeleteQuizSet = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este cuestionario completo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // Eliminar todas las preguntas primero
      for (const quiz of quizzes) {
        await axios.delete(`/quizzes/${quiz._id}`);
      }
      // Eliminar el quiz set
      await axios.delete(`/quiz-sets/${id}`);
      alert('Cuestionario eliminado exitosamente');
      navigate('/quizzes');
    } catch (err) {
      alert('Error al eliminar el cuestionario');
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    
    if (!newQuestion || newOptions.some(opt => !opt) || !newCorrectAnswer) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await axios.post('/quizzes', {
        question: newQuestion,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
        topic_id: quizSet.topic_id,
        quiz_set_id: id,
        order: quizzes.length
      });

      // Limpiar formulario
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setNewCorrectAnswer('');
      setShowAddQuiz(false);
      loadQuizSet();
      alert('Pregunta agregada exitosamente');
    } catch (err) {
      alert('Error al agregar la pregunta');
    }
  };

  const handleUpdateQuiz = async (quizId) => {
    const quiz = quizzes.find(q => q._id === quizId);
    if (!quiz) return;

    try {
      await axios.patch(`/quizzes/${quizId}`, {
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer
      });
      setEditingQuiz(null);
      alert('Pregunta actualizada exitosamente');
      loadQuizSet();
    } catch (err) {
      alert('Error al actualizar la pregunta');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;

    try {
      await axios.delete(`/quizzes/${quizId}`);
      loadQuizSet();
      alert('Pregunta eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar la pregunta');
    }
  };

  const updateQuizField = (quizId, field, value) => {
    setQuizzes(quizzes.map(q => 
      q._id === quizId ? { ...q, [field]: value } : q
    ));
  };

  const updateQuizOption = (quizId, index, value) => {
    setQuizzes(quizzes.map(q => {
      if (q._id === quizId) {
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  if (!quizSet) return <div className="loading">Cargando...</div>;

  return (
    <div className="edit-quiz-set-container">
      <button className="back-button" onClick={() => navigate('/quizzes')}>
        ← Volver a Cuestionarios
      </button>

      <div className="edit-quiz-set-card">
        <h1>✏️ Editar Cuestionario</h1>

        <form onSubmit={handleUpdateQuizSet} className="quiz-set-form">
          <div className="form-group">
            <label>Nombre del Cuestionario *</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="Ej: Evaluación de Phishing - Nivel Básico"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción opcional del cuestionario"
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Cuestionario activo</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              💾 Guardar Cambios
            </button>
            <button type="button" className="btn-delete-set" onClick={handleDeleteQuizSet}>
              🗑️ Eliminar Cuestionario
            </button>
          </div>
        </form>
      </div>

      <div className="quizzes-management-section">
        <div className="section-header">
          <h2>📝 Preguntas ({quizzes.length})</h2>
          <button className="btn-add-question" onClick={() => setShowAddQuiz(!showAddQuiz)}>
            {showAddQuiz ? '✖ Cancelar' : '+ Agregar Pregunta'}
          </button>
        </div>

        {showAddQuiz && (
          <div className="add-quiz-form">
            <h3>Nueva Pregunta</h3>
            <form onSubmit={handleAddQuiz}>
              <div className="form-group">
                <label>Pregunta *</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Escribe la pregunta"
                  required
                />
              </div>

              <div className="form-group">
                <label>Opciones *</label>
                {newOptions.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const opts = [...newOptions];
                      opts[index] = e.target.value;
                      setNewOptions(opts);
                    }}
                    placeholder={`Opción ${index + 1}`}
                    required
                  />
                ))}
              </div>

              <div className="form-group">
                <label>Respuesta Correcta *</label>
                <select
                  value={newCorrectAnswer}
                  onChange={(e) => setNewCorrectAnswer(e.target.value)}
                  required
                >
                  <option value="">Selecciona la respuesta correcta</option>
                  {newOptions.map((option, index) => (
                    <option key={index} value={option} disabled={!option}>
                      {option || `Opción ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-save-quiz">
                ✓ Agregar Pregunta
              </button>
            </form>
          </div>
        )}

        <div className="quizzes-list">
          {quizzes.length === 0 ? (
            <div className="no-quizzes-message">
              <p>📚 No hay preguntas en este cuestionario.</p>
              <p>Agrega la primera pregunta usando el botón de arriba.</p>
            </div>
          ) : (
            quizzes.map((quiz, index) => (
              <div key={quiz._id} className="quiz-item-edit">
                <div className="quiz-item-header">
                  <span className="quiz-number">Pregunta {index + 1}</span>
                  <div className="quiz-item-actions">
                    {editingQuiz === quiz._id ? (
                      <>
                        <button
                          className="btn-save-edit"
                          onClick={() => handleUpdateQuiz(quiz._id)}
                        >
                          ✓ Guardar
                        </button>
                        <button
                          className="btn-cancel-edit"
                          onClick={() => setEditingQuiz(null)}
                        >
                          ✖ Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-edit-quiz"
                          onClick={() => setEditingQuiz(quiz._id)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-delete-quiz"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingQuiz === quiz._id ? (
                  <div className="quiz-edit-form">
                    <input
                      type="text"
                      value={quiz.question}
                      onChange={(e) => updateQuizField(quiz._id, 'question', e.target.value)}
                      placeholder="Pregunta"
                    />
                    {quiz.options.map((option, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={option}
                        onChange={(e) => updateQuizOption(quiz._id, idx, e.target.value)}
                        placeholder={`Opción ${idx + 1}`}
                      />
                    ))}
                    <select
                      value={quiz.correctAnswer}
                      onChange={(e) => updateQuizField(quiz._id, 'correctAnswer', e.target.value)}
                    >
                      {quiz.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="quiz-display">
                    <p className="quiz-question">{quiz.question}</p>
                    <div className="quiz-options">
                      {quiz.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`quiz-option ${option === quiz.correctAnswer ? 'correct' : ''}`}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                          <span>{option}</span>
                          {option === quiz.correctAnswer && (
                            <span className="correct-badge">✓ Correcta</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

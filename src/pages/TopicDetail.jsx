import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './TopicDetail.css';

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const load = async () => {
    try {
      const [topicRes, quizzesRes] = await Promise.all([
        axios.get(`/topics/${id}`),
        axios.get(`/quizzes/topic/${id}`)
      ]);
      setTopic(topicRes.data);
      setQuizzes(quizzesRes.data);
      setEditName(topicRes.data.topic_name);
      setEditDesc(topicRes.data.description);
    } catch (e) {
      setError('No se pudo cargar el tema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName || editDesc.length < 10) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    try {
      await axios.patch(`/topics/${id}`, { topic_name: editName, description: editDesc });
      await load();
      setShowEditModal(false);
      alert('Tema actualizado exitosamente');
    } catch (e) {
      alert('No se pudo actualizar el tema');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    try {
      await axios.delete(`/quizzes/${quizId}`);
      await load();
    } catch (e) {
      alert('Error al eliminar la pregunta');
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!topic) return null;

  return (
    <div className="topic-detail-container">
      <button className="back-button" onClick={() => navigate('/topics')}>
        ← Volver a Temas
      </button>

      <div className="topic-detail-card">
        <div className="topic-header-section">
          <div>
            <h1 className="topic-detail-title">{topic.topic_name}</h1>
            <p className="topic-detail-description">{topic.description}</p>
          </div>
          {user?.role === 'docente' && (
            <button className="btn-edit-topic" onClick={() => setShowEditModal(true)}>
              ✏️ Editar Tema
            </button>
          )}
        </div>
      </div>

      <div className="quizzes-section">
        <div className="quizzes-header">
          <h2>Preguntas de Evaluación</h2>
          {user?.role === 'docente' && (
            <button className="btn-add-quiz" onClick={() => navigate('/crear-quiz')}>
              + Agregar Pregunta
            </button>
          )}
        </div>

        {quizzes.length === 0 ? (
          <div className="no-quizzes">
            <p>📚 Aún no hay preguntas para este tema.</p>
            {user?.role === 'docente' && (
              <p className="hint">Crea la primera pregunta para comenzar.</p>
            )}
          </div>
        ) : (
          <div className="quizzes-list">
            {quizzes.map((quiz, index) => (
              <div key={quiz._id} className="quiz-item">
                <div className="quiz-number">Pregunta {index + 1}</div>
                <div className="quiz-question">{quiz.question}</div>
                <div className="quiz-options">
                  {quiz.options.map((option, idx) => (
                    <div 
                      key={idx} 
                      className={`quiz-option ${option === quiz.correctAnswer ? 'correct-option' : ''}`}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span>{option}</span>
                      {user?.role === 'docente' && option === quiz.correctAnswer && (
                        <span className="correct-badge">✓ Correcta</span>
                      )}
                    </div>
                  ))}
                </div>
                {user?.role === 'docente' && (
                  <button 
                    className="btn-delete-quiz"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {quizzes.length > 0 && user?.role === 'estudiante' && (
          <button 
            className="btn-start-quiz"
            onClick={() => navigate('/quizzes')}
          >
            🎯 Comenzar Evaluación
          </button>
        )}
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Tema</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                className="modal-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre del tema"
              />
              <textarea
                className="modal-textarea"
                rows={4}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Descripción (mínimo 10 caracteres)"
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

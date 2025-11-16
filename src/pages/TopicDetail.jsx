import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ContentEditor from '../components/ContentEditor';
import CodeBlock from '../components/CodeBlock';
import LiveCodeBlock from '../components/LiveCodeBlock';
import './TopicDetail.css';

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizSets, setQuizSets] = useState([]);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(`/topics/${id}`);
      setTopic(res.data);
      setEditName(res.data.topic_name);
      setEditDesc(res.data.description);
      setContentBlocks(res.data.content || []);

      const quizSetsRes = await axios.get(`/quiz-sets/topic/${id}`);
      setQuizSets(quizSetsRes.data);
    } catch (err) {
      console.error('Error al cargar tema:', err);
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
      await axios.patch(`/topics/${id}`, { 
        topic_name: editName, 
        description: editDesc 
      });
      await load();
      setShowEditModal(false);
      alert('Tema actualizado exitosamente');
    } catch (e) {
      alert('No se pudo actualizar el tema');
    }
  };

  const handleContentUpdate = async (updatedContent) => {
    try {
      await axios.patch(`/topics/${id}`, { content: updatedContent });
      setContentBlocks(updatedContent);
    } catch (e) {
      console.error('Error al actualizar contenido:', e);
    }
  };

  const getBlockStyle = (block) => {
    if (!block.style) return {};
    
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem'
    };

    return {
      color: block.style.color || '#333',
      fontSize: fontSizeMap[block.style.fontSize] || '1rem',
      fontWeight: block.style.fontWeight || 'normal',
      fontStyle: block.style.fontStyle || 'normal',
      textAlign: block.style.textAlign || 'left',
      backgroundColor: block.style.backgroundColor !== 'transparent' ? block.style.backgroundColor : undefined,
      padding: block.style.backgroundColor !== 'transparent' ? '1rem' : undefined,
      borderRadius: block.style.backgroundColor !== 'transparent' ? '8px' : undefined
    };
  };

  const renderContentBlock = (block) => {
    const style = getBlockStyle(block);
    
    switch (block.type) {
      case 'heading':
        return <h3 className="content-heading" style={style}>{block.content}</h3>;
      case 'text':
        return <p className="content-text" style={style}>{block.content}</p>;
      case 'list':
        return (
          <ul 
            className="content-list" 
            style={{
              ...style,
              listStyleType: block.style?.listStyle || 'disc'
            }}
          >
            {block.content.split('\n').filter(item => item.trim()).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      case 'code-static':
        return (
          <CodeBlock 
            code={block.content}
            language={block.style?.codeLanguage || 'javascript'}
            theme={block.style?.codeTheme || 'dark'}
            showLineNumbers={true}
          />
        );
      case 'code-live':
        return (
          <LiveCodeBlock 
            htmlContent={block.htmlContent || ''}
            showCode={block.showCode || false}
            editable={false}
          />
        );
      case 'quote':
        return <blockquote className="content-quote" style={style}>{block.content}</blockquote>;
      default:
        return <p style={style}>{block.content}</p>;
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

  if (!topic) return <div className="loading-container">Cargando...</div>;

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
              ✒️ Editar Tema
            </button>
          )}
        </div>

        {/* Sección de Contenido */}
        {user?.role === 'docente' ? (
          <ContentEditor content={contentBlocks} onChange={handleContentUpdate} />
        ) : (
          contentBlocks && contentBlocks.length > 0 && (
            <div className="topic-content-display">
              <h3 className="content-section-title">📚 Contenido del Tema</h3>
              <div className="content-blocks-display">
                {contentBlocks.map((block) => (
                  <div key={block.id} className="content-block-display">
                    {renderContentBlock(block)}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="quizzes-section">
        <div className="quizzes-header">
          <h2>📋 Cuestionarios Disponibles</h2>
          {user?.role === 'docente' && (
            <button className="btn-add-quiz" onClick={() => navigate('/crear-quiz')}>
              + Crear Cuestionario
            </button>
          )}
        </div>

        {quizSets.length === 0 ? (
          <div className="no-quizzes">
            <p>📚 Aún no hay cuestionarios para este tema.</p>
            {user?.role === 'docente' && (
              <p className="hint">Crea el primer cuestionario para comenzar.</p>
            )}
          </div>
        ) : (
          <div className="quiz-sets-grid">
            {quizSets.map((quizSet) => (
              <div key={quizSet._id} className="quiz-set-card">
                <div className="quiz-set-card-header">
                  <h3>{quizSet.quiz_name}</h3>
                  {quizSet.isActive && <span className="active-badge">✓ Activo</span>}
                </div>
                {quizSet.description && (
                  <p className="quiz-set-card-description">{quizSet.description}</p>
                )}
                <div className="quiz-set-actions">
                  {user?.role === 'estudiante' ? (
                    <button 
                      className="btn-take-quiz"
                      onClick={() => navigate('/quizzes')}
                    >
                      🎯 Resolver Cuestionario →
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn-edit-quiz-set"
                        onClick={() => navigate(`/edit-quiz-set/${quizSet._id}`)}
                      >
                        ✒️ Editar
                      </button>
                      <button 
                        className="btn-view-quiz"
                        onClick={() => navigate('/quizzes')}
                      >
                        👁️ Ver
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
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

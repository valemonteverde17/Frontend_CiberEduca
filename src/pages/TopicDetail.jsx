import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ContentEditor from '../components/ContentEditor';
import CodeBlock from '../components/CodeBlock';
import LiveCodeBlock from '../components/LiveCodeBlock';
import { 
  canEditTopic, 
  canDeleteTopic, 
  canSubmitForReview, 
  canReviewTopic,
  canArchiveTopic,
  canEditContent,
  canEditQuizzes,
  getStatusBadge,
  getVisibilityBadge,
  getAvailableActions
} from '../utils/topicPermissions';
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
  const [editTags, setEditTags] = useState([]);
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('beginner');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [cardColor, setCardColor] = useState('#2b9997');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/topics/${id}`);
      setTopic(res.data);
      setEditName(res.data.topic_name);
      setEditDesc(res.data.description);
      setEditTags(res.data.tags || []);
      setEditTagsInput(Array.isArray(res.data.tags) ? res.data.tags.join(', ') : '');
      setEditDifficulty(res.data.difficulty || 'beginner');
      setContentBlocks(res.data.content || []);
      setCardColor(res.data.cardColor || '#2b9997');

      const quizSetsRes = await axios.get(`/quiz-sets/topic/${id}`).catch(() => ({ data: [] }));
      setQuizSets(quizSetsRes.data);
    } catch (err) {
      console.error('Error al cargar tema:', err);
      setError(err.response?.data?.message || 'Error al cargar el tema');
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
    // Convertir tags de string a array
    const tagsArray = editTagsInput ? editTagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    try {
      await axios.patch(`/topics/${id}`, { 
        topic_name: editName, 
        description: editDesc,
        cardColor: cardColor,
        tags: tagsArray,
        difficulty: editDifficulty
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
      // Recargar el tema completo para asegurar que se guardó correctamente
      await load();
      console.log('✅ Contenido guardado exitosamente');
    } catch (e) {
      console.error('❌ Error al actualizar contenido:', e);
      alert('Error al guardar el contenido. Por favor intenta de nuevo.');
    }
  };

  const handleSubmitForReview = async () => {
    if (!window.confirm('¿Enviar este tema a revisión? No podrás editarlo hasta que sea revisado.')) return;
    try {
      await axios.post(`/topics/${id}/submit-review`);
      await load();
      alert('✅ Tema enviado a revisión exitosamente');
    } catch (err) {
      alert('Error al enviar a revisión: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    const comments = prompt('Comentarios de aprobación (opcional):');
    try {
      await axios.post(`/topics/${id}/approve`, { comments });
      await load();
      alert('✅ Tema aprobado exitosamente');
    } catch (err) {
      alert('Error al aprobar tema: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async () => {
    const comments = prompt('Comentarios de rechazo (requerido):');
    if (!comments) {
      alert('Debes proporcionar comentarios para rechazar un tema');
      return;
    }
    try {
      await axios.post(`/topics/${id}/reject`, { comments });
      await load();
      alert('Tema rechazado');
    } catch (err) {
      alert('Error al rechazar tema');
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('¿Archivar este tema?')) return;
    try {
      await axios.post(`/topics/${id}/archive`);
      await load();
      alert('Tema archivado');
    } catch (err) {
      alert('Error al archivar tema');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('⚠️ ¿ELIMINAR este tema permanentemente?')) return;
    try {
      await axios.delete(`/topics/${id}`);
      alert('Tema eliminado');
      navigate('/topics');
    } catch (err) {
      alert('Error al eliminar tema');
    }
  };

  // Obtener acciones disponibles
  const availableActions = topic ? getAvailableActions(user, topic) : [];

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

  if (loading) {
    return (
      <div className="topic-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topic-detail-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/topics')} className="btn-back">
          ← Volver a Temas
        </button>
      </div>
    );
  }

  if (!topic) return null;

  const statusBadge = getStatusBadge(topic.status);
  const visibilityBadge = getVisibilityBadge(topic.visibility);

  return (
    <div className="topic-detail-container">
      <button className="back-button" onClick={() => navigate('/topics')}>
        ← Volver a Temas
      </button>

      <div className="topic-detail-card">
        <div className="topic-header-section">
          <div className="topic-header-info">
            <h1 className="topic-detail-title">{topic.topic_name}</h1>
            <p className="topic-detail-description">{topic.description}</p>
            
            {/* Badges */}
            <div className="topic-detail-badges">
              <span 
                className="topic-detail-badge status-badge"
                style={{ backgroundColor: statusBadge.color }}
              >
                {statusBadge.icon} {statusBadge.text}
              </span>
              <span className="topic-detail-badge visibility-badge">
                {visibilityBadge.icon} {visibilityBadge.text}
              </span>
            </div>

            {/* Metadata */}
            <div className="topic-detail-meta">
              {topic.created_by && (
                <span className="meta-item">
                  👤 <strong>Autor:</strong> {topic.created_by.user_name}
                </span>
              )}
              {topic.organization_id && (
                <span className="meta-item">
                  🏢 <strong>Organización:</strong> {topic.organization_id.name}
                </span>
              )}
              {topic.difficulty && (
                <span className="meta-item">
                  📊 <strong>Dificultad:</strong> {topic.difficulty}
                </span>
              )}
              <span className="meta-item">
                📅 <strong>Creado:</strong> {new Date(topic.createdAt).toLocaleDateString('es-MX')}
              </span>
              {topic.publishedAt && (
                <span className="meta-item">
                  ✅ <strong>Publicado:</strong> {new Date(topic.publishedAt).toLocaleDateString('es-MX')}
                </span>
              )}
            </div>

            {/* Tags */}
            {topic.tags && topic.tags.length > 0 && (
              <div className="topic-detail-tags">
                {topic.tags.map((tag, index) => (
                  <span key={index} className="topic-tag">#{tag}</span>
                ))}
              </div>
            )}
            
            {/* Comentarios de revisión */}
            {topic.review_comments && (
              <div className="review-comments-box">
                <h4>💬 Comentarios del Revisor:</h4>
                <p>{topic.review_comments}</p>
                {topic.reviewed_by && (
                  <p className="reviewer-name">— {topic.reviewed_by.user_name}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Botones de acción según permisos */}
          {availableActions.length > 0 && (
            <div className="topic-header-actions">
              {availableActions.includes('edit') && (
                <>
                  <button className="btn-action btn-preview" onClick={() => setPreviewMode(!previewMode)}>
                    {previewMode ? '✒️ Editar' : '👁️ Vista Previa'}
                  </button>
                  <button className="btn-action btn-edit" onClick={() => setShowEditModal(true)}>
                    ✏️ Editar Info
                  </button>
                </>
              )}
              
              {availableActions.includes('submit-review') && (
                <button className="btn-action btn-submit" onClick={handleSubmitForReview}>
                  📤 Enviar a Revisión
                </button>
              )}
              
              {availableActions.includes('approve') && (
                <button className="btn-action btn-approve" onClick={handleApprove}>
                  ✅ Aprobar
                </button>
              )}
              
              {availableActions.includes('reject') && (
                <button className="btn-action btn-reject" onClick={handleReject}>
                  ❌ Rechazar
                </button>
              )}
              
              {availableActions.includes('archive') && (
                <button className="btn-action btn-archive" onClick={handleArchive}>
                  📦 Archivar
                </button>
              )}
              
              {availableActions.includes('delete') && (
                <button className="btn-action btn-delete" onClick={handleDelete}>
                  🗑️ Eliminar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sección de Contenido */}
        {canEditContent(user, topic) && !previewMode ? (
          <ContentEditor content={contentBlocks} onChange={handleContentUpdate} />
        ) : (
          contentBlocks && contentBlocks.length > 0 ? (
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
          ) : (
            <div className="no-content">
              <p>📝 Este tema aún no tiene contenido</p>
              {canEditContent(user, topic) && (
                <p className="hint">Comienza agregando bloques de contenido</p>
              )}
            </div>
          )
        )}
      </div>

      <div className="quizzes-section">
        <div className="quizzes-header">
          <h2>📋 Cuestionarios Disponibles</h2>
          {canEditQuizzes(user, topic) && (
            <button className="btn-add-quiz" onClick={() => navigate('/crear-quiz')}>
              + Crear Cuestionario
            </button>
          )}
        </div>

        {quizSets.length === 0 ? (
          <div className="no-quizzes">
            <p>📚 Aún no hay cuestionarios para este tema.</p>
            {canEditQuizzes(user, topic) && (
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
                      {canEditQuizzes(user, topic) && (
                        <button 
                          className="btn-edit-quiz-set"
                          onClick={() => navigate(`/edit-quiz-set/${quizSet._id}`)}
                        >
                          ✒️ Editar
                        </button>
                      )}
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

              <div className="form-group">
                <label className="form-label">🏷️ Tags (separados por coma)</label>
                <input
                  type="text"
                  placeholder="Ej: ciberseguridad, contraseñas, seguridad"
                  value={editTagsInput}
                  onChange={(e) => setEditTagsInput(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">📊 Dificultad</label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value)}
                  className="modal-select"
                >
                  <option value="beginner">🟢 Principiante</option>
                  <option value="intermediate">🟡 Intermedio</option>
                  <option value="advanced">🔴 Avanzado</option>
                </select>
              </div>
              
              <div className="color-picker-section">
                <label className="color-picker-label">
                  🎨 Color de la Card del Tema
                </label>
                <div className="color-picker-full">
                  <div className="color-presets-row">
                    <span className="presets-label">Colores rápidos:</span>
                    {[
                      { name: 'Verde Agua', value: '#2b9997' },
                      { name: 'Azul', value: '#3b82f6' },
                      { name: 'Morado', value: '#8b5cf6' },
                      { name: 'Rosa', value: '#ec4899' },
                      { name: 'Naranja', value: '#f97316' },
                      { name: 'Verde', value: '#10b981' },
                      { name: 'Rojo', value: '#ef4444' },
                      { name: 'Amarillo', value: '#f59e0b' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`color-preset-btn-small ${cardColor === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setCardColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  
                  <div className="color-custom-picker">
                    <label className="custom-picker-label">Color personalizado:</label>
                    <input
                      type="color"
                      className="color-picker-input-large"
                      value={cardColor}
                      onChange={(e) => setCardColor(e.target.value)}
                      title="Selector de color RGB completo"
                    />
                    <input
                      type="text"
                      className="color-hex-input"
                      value={cardColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          setCardColor(value);
                        }
                      }}
                      placeholder="#2b9997"
                      maxLength={7}
                    />
                  </div>
                  
                  <div className="color-preview-large" style={{ backgroundColor: cardColor }}>
                    <span>Vista previa del color de la card</span>
                  </div>
                </div>
              </div>

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

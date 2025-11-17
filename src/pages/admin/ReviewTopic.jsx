import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import CodeBlock from '../../components/CodeBlock';
import LiveCodeBlock from '../../components/LiveCodeBlock';
import './ReviewTopic.css';

export default function ReviewTopic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      const res = await axios.get(`/topics/${id}`);
      setTopic(res.data);
    } catch (err) {
      console.error('Error al cargar tema:', err);
      alert('Error al cargar el tema');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('¿Aprobar este tema?')) return;
    try {
      await axios.post(`/topics/${id}/approve`, { comments });
      alert('✅ Tema aprobado exitosamente');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('❌ Error al aprobar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      alert('⚠️ Debes agregar comentarios al rechazar un tema');
      return;
    }
    if (!window.confirm('¿Rechazar este tema?')) return;
    try {
      await axios.post(`/topics/${id}/reject`, { comments });
      alert('✅ Tema rechazado');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('❌ Error al rechazar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRequestChanges = async () => {
    if (!comments.trim()) {
      alert('⚠️ Debes agregar comentarios al solicitar cambios');
      return;
    }
    if (!window.confirm('¿Solicitar cambios en este tema?')) return;
    try {
      await axios.post(`/topics/${id}/request-changes`, { comments });
      alert('✅ Cambios solicitados');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderContentBlock = (block) => {
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

  if (loading) {
    return <div className="loading-container">Cargando tema...</div>;
  }

  if (!topic) {
    return <div className="loading-container">Tema no encontrado</div>;
  }

  return (
    <div className="review-topic-page">
      <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
        ← Volver al Dashboard
      </button>

      <div className="review-header">
        <h1>Revisar Tema</h1>
        <span className="status-badge status-pending_review">
          ⌛ Pendiente de Revisión
        </span>
      </div>

      {/* Vista Previa del Tema */}
      <div className="topic-preview-card">
        <div className="topic-preview-header">
          <h2>{topic.topic_name}</h2>
          <p className="topic-description">{topic.description}</p>
          <div className="topic-meta">
            <span>👤 Creado por: <strong>{topic.created_by?.user_name || 'Desconocido'}</strong></span>
            <span>📅 Fecha: <strong>{new Date(topic.createdAt).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Contenido del Tema */}
        {topic.content && topic.content.length > 0 && (
          <div className="topic-content-preview">
            <h3 className="content-section-title">📚 Contenido del Tema</h3>
            <div className="content-blocks-display">
              {topic.content.map((block) => (
                <div key={block.id} className="content-block-display">
                  {renderContentBlock(block)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sección de Revisión */}
      <div className="review-section-card">
        <h3>💬 Comentarios de Revisión</h3>
        <p className="review-hint">
          Agrega comentarios para el docente. Son opcionales si apruebas, pero obligatorios si rechazas o solicitas cambios.
        </p>
        <textarea
          className="review-textarea"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Escribe tus comentarios aquí... (opcional para aprobar, obligatorio para rechazar)"
          rows={6}
        />
      </div>

      {/* Acciones de Revisión */}
      <div className="review-actions">
        <button className="btn-approve-review" onClick={handleApprove}>
          ✅ Aprobar Tema
        </button>
        <button className="btn-changes-review" onClick={handleRequestChanges}>
          🔄 Solicitar Cambios
        </button>
        <button className="btn-reject-review" onClick={handleReject}>
          ❌ Rechazar Tema
        </button>
      </div>
    </div>
  );
}

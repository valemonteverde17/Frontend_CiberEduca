import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getAvailableActions, 
  getStatusBadge, 
  getVisibilityBadge 
} from '../../utils/topicPermissions';
import './TopicCard.css';

export default function TopicCard({ topic, onEdit, onDelete, onSubmitReview, onApprove, onReject, onArchive }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!topic) return null;
  
  const actions = getAvailableActions(user, topic);
  const statusBadge = getStatusBadge(topic.status);
  const visibilityBadge = getVisibilityBadge(topic.visibility);
  
  const handleView = () => {
    navigate(`/topics/${topic._id}`);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(topic);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(topic._id);
  };
  
  const handleSubmitReview = (e) => {
    e.stopPropagation();
    if (onSubmitReview) onSubmitReview(topic._id);
  };
  
  const handleApprove = (e) => {
    e.stopPropagation();
    if (onApprove) onApprove(topic._id);
  };
  
  const handleReject = (e) => {
    e.stopPropagation();
    if (onReject) onReject(topic._id);
  };
  
  const handleArchive = (e) => {
    e.stopPropagation();
    if (onArchive) onArchive(topic._id);
  };
  
  return (
    <div 
      className="topic-card" 
      style={{ borderLeftColor: topic.cardColor || '#2b9997' }}
      onClick={handleView}
    >
      {/* Header con badges */}
      <div className="topic-card-header">
        <div className="topic-badges">
          <span 
            className="topic-badge status-badge"
            style={{ backgroundColor: statusBadge.color }}
          >
            {statusBadge.icon} {statusBadge.text}
          </span>
          <span className="topic-badge visibility-badge">
            {visibilityBadge.icon} {visibilityBadge.text}
          </span>
        </div>
        
        {/* Color indicator */}
        <div 
          className="topic-color-indicator"
          style={{ backgroundColor: topic.cardColor || '#2b9997' }}
        />
      </div>
      
      {/* Contenido principal */}
      <div className="topic-card-content">
        <h3 className="topic-card-title">{topic.topic_name}</h3>
        <p className="topic-card-description">
          {topic.description?.substring(0, 120)}
          {topic.description?.length > 120 && '...'}
        </p>
        
        {/* Metadata */}
        <div className="topic-card-meta">
          {topic.created_by && (
            <span className="topic-meta-item">
              👤 {topic.created_by.user_name || 'Desconocido'}
            </span>
          )}
          
          {topic.organization_id && (
            <span className="topic-meta-item">
              🏢 {topic.organization_id.name || 'Sin organización'}
            </span>
          )}
          
          {topic.difficulty && (
            <span className="topic-meta-item">
              📊 {topic.difficulty}
            </span>
          )}
        </div>
        
        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="topic-card-tags">
            {topic.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="topic-tag">
                #{tag}
              </span>
            ))}
            {topic.tags.length > 3 && (
              <span className="topic-tag-more">
                +{topic.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Comentarios de revisión */}
        {topic.review_comments && (
          <div className="topic-review-comments">
            <strong>💬 Comentarios:</strong>
            <p>{topic.review_comments}</p>
          </div>
        )}
      </div>
      
      {/* Acciones */}
      {actions.length > 0 && (
        <div className="topic-card-actions">
          {actions.includes('edit') && (
            <button 
              className="topic-action-btn edit-btn"
              onClick={handleEdit}
              title="Editar tema"
            >
              ✏️ Editar
            </button>
          )}
          
          {actions.includes('submit-review') && (
            <button 
              className="topic-action-btn submit-btn"
              onClick={handleSubmitReview}
              title="Enviar a revisión"
            >
              📤 Enviar a Revisión
            </button>
          )}
          
          {actions.includes('approve') && (
            <button 
              className="topic-action-btn approve-btn"
              onClick={handleApprove}
              title="Aprobar tema"
            >
              ✅ Aprobar
            </button>
          )}
          
          {actions.includes('reject') && (
            <button 
              className="topic-action-btn reject-btn"
              onClick={handleReject}
              title="Rechazar tema"
            >
              ❌ Rechazar
            </button>
          )}
          
          {actions.includes('archive') && (
            <button 
              className="topic-action-btn archive-btn"
              onClick={handleArchive}
              title="Archivar tema"
            >
              📦 Archivar
            </button>
          )}
          
          {actions.includes('delete') && (
            <button 
              className="topic-action-btn delete-btn"
              onClick={handleDelete}
              title="Eliminar tema"
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
      
      {/* Footer con fecha */}
      <div className="topic-card-footer">
        <span className="topic-date">
          📅 {new Date(topic.createdAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
        
        {topic.publishedAt && (
          <span className="topic-date published">
            ✅ Publicado: {new Date(topic.publishedAt).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )}
      </div>
    </div>
  );
}

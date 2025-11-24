import './TopicStatusBadge.css';

const statusConfig = {
  draft: { 
    label: 'Borrador', 
    color: '#9e9e9e', 
    icon: '📝',
    description: 'Tema en edición inicial'
  },
  pending_approval: { 
    label: 'Pendiente', 
    color: '#ff9800', 
    icon: '⏳',
    description: 'Esperando aprobación del administrador'
  },
  approved: { 
    label: 'Aprobado', 
    color: '#4caf50', 
    icon: '✅',
    description: 'Tema aprobado y visible para estudiantes'
  },
  editing: { 
    label: 'En Edición', 
    color: '#2196f3', 
    icon: '✏️',
    description: 'Tema en proceso de edición'
  },
  rejected: { 
    label: 'Rechazado', 
    color: '#f44336', 
    icon: '❌',
    description: 'Tema rechazado por el administrador'
  },
  deleted: { 
    label: 'Eliminado', 
    color: '#757575', 
    icon: '🗑️',
    description: 'Tema en papelera'
  }
};

export default function TopicStatusBadge({ status, showTooltip = true }) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span 
      className="topic-status-badge" 
      style={{ backgroundColor: config.color }}
      title={showTooltip ? config.description : ''}
    >
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
    </span>
  );
}

import { useNavigate } from 'react-router-dom';
import './ContentTable.css';

export default function ContentTable({ 
  items, 
  type = 'topics', // 'topics' o 'quizzes'
  onApprove, 
  onReject,
  canReview = false 
}) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const badges = {
      draft: { text: '📝 Borrador', class: 'content-status-draft' },
      pending_review: { text: '⏳ En Revisión', class: 'content-status-pending' },
      approved: { text: '✅ Aprobado', class: 'content-status-approved' },
      rejected: { text: '❌ Rechazado', class: 'content-status-rejected' },
      archived: { text: '🗄️ Archivado', class: 'content-status-archived' }
    };
    return badges[status] || { text: status, class: '' };
  };

  const handleView = (id) => {
    if (type === 'topics') {
      navigate(`/topic/${id}`);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  return (
    <div className="content-table-container">
      <div className="content-table-wrapper">
        <table className="content-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Organización</th>
              <th>Estado</th>
              <th>Fecha</th>
              {canReview && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={canReview ? 6 : 5} className="content-table-empty">
                  No hay {type === 'topics' ? 'temas' : 'quizzes'} pendientes
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                const title = type === 'topics' ? item.topic_name : item.title;
                const author = item.created_by?.user_name || 'Desconocido';
                const org = item.organization_id?.name || 'Sin organización';
                const date = new Date(item.createdAt).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr key={item._id} onClick={() => handleView(item._id)} className="content-table-row">
                    <td>
                      <div className="content-table-title">
                        <span className="content-table-icon">
                          {type === 'topics' ? '📚' : '📋'}
                        </span>
                        <span>{title}</span>
                      </div>
                    </td>
                    <td>
                      <div className="content-table-author">
                        <span className="author-icon">👤</span>
                        {author}
                      </div>
                    </td>
                    <td>
                      <span className="content-table-org">{org}</span>
                    </td>
                    <td>
                      <span className={`content-table-status ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      <span className="content-table-date">{date}</span>
                    </td>
                    {canReview && (
                      <td>
                        <div className="content-table-actions" onClick={(e) => e.stopPropagation()}>
                          {item.status === 'pending_review' && (
                            <>
                              <button
                                className="content-table-btn btn-approve"
                                onClick={() => onApprove(item._id)}
                                title="Aprobar"
                              >
                                ✅ Aprobar
                              </button>
                              <button
                                className="content-table-btn btn-reject"
                                onClick={() => onReject(item._id)}
                                title="Rechazar"
                              >
                                ❌ Rechazar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="content-table-footer">
        <p>Mostrando {items.length} {type === 'topics' ? 'temas' : 'quizzes'}</p>
      </div>
    </div>
  );
}

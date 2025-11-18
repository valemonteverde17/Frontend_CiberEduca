/**
 * Servicio de Permisos para Temas
 * Define la lógica de permisos según roles y organizaciones
 */

/**
 * Verifica si el usuario puede crear temas
 */
export const canCreateTopic = (user) => {
  if (!user) return false;
  return ['docente', 'admin'].includes(user.role);
};

/**
 * Verifica si el usuario puede editar un tema específico
 */
export const canEditTopic = (user, topic) => {
  if (!user || !topic) return false;
  
  // Super admin puede editar todo siempre
  if (user.is_super) return true;
  
  // Si el tema está aprobado, solo admin/super pueden editar
  if (topic.status === 'approved') {
    if (user.role === 'admin') {
      return topic.organization_id?._id === user.organization_id || 
             topic.organization_id === user.organization_id;
    }
    return false; // Docentes no pueden editar temas aprobados
  }
  
  // Admin puede editar temas de su organización (no aprobados)
  if (user.role === 'admin') {
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  // Docente solo puede editar sus propios temas en draft o rejected
  if (user.role === 'docente') {
    const isOwner = topic.created_by?._id === user._id || 
                    topic.created_by === user._id;
    const isEditable = ['draft', 'rejected'].includes(topic.status);
    return isOwner && isEditable;
  }
  
  return false;
};

/**
 * Verifica si el usuario puede eliminar un tema
 */
export const canDeleteTopic = (user, topic) => {
  if (!user || !topic) return false;
  
  // Super admin puede eliminar todo
  if (user.is_super) return true;
  
  // Admin puede eliminar temas de su organización
  if (user.role === 'admin') {
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  // Docente solo puede eliminar sus propios temas en draft
  if (user.role === 'docente') {
    const isOwner = topic.created_by?._id === user._id || topic.created_by === user._id;
    const isDraft = topic.status === 'draft';
    return isOwner && isDraft;
  }
  
  return false;
};

/**
 * Verifica si el usuario puede aprobar/rechazar temas
 */
export const canReviewTopic = (user, topic) => {
  if (!user || !topic) return false;
  
  // Super admin puede revisar todo
  if (user.is_super) return true;
  
  // Admin y revisor pueden revisar temas de su organización
  if (['admin', 'revisor'].includes(user.role)) {
    // Si el tema no tiene organización, solo super admin puede revisarlo
    if (!topic.organization_id && !user.is_super) return false;
    
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  return false;
};

/**
 * Verifica si el usuario puede enviar un tema a revisión
 */
export const canSubmitForReview = (user, topic) => {
  if (!user || !topic) return false;
  
  // Solo el creador puede enviar a revisión
  const isOwner = topic.created_by?._id === user._id || topic.created_by === user._id;
  
  // El tema debe estar en draft o rejected (puede reenviar múltiples veces)
  const canSubmit = ['draft', 'rejected'].includes(topic.status);
  
  return isOwner && canSubmit && user.role === 'docente';
};

/**
 * Verifica si el usuario puede ver un tema
 */
export const canViewTopic = (user, topic) => {
  if (!topic) return false;
  
  // Temas públicos aprobados pueden ser vistos por todos
  if (topic.status === 'approved' && topic.visibility === 'public') {
    return true;
  }
  
  if (!user) return false;
  
  // Super admin puede ver todo
  if (user.is_super) return true;
  
  // Admin y revisor pueden ver todo de su organización
  if (['admin', 'revisor'].includes(user.role)) {
    if (!topic.organization_id) return true; // Temas sin org
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  // Docente puede ver sus propios temas + aprobados de su org
  if (user.role === 'docente') {
    const isOwner = topic.created_by?._id === user._id || topic.created_by === user._id;
    if (isOwner) return true;
    
    if (topic.status === 'approved') {
      if (topic.visibility === 'public') return true;
      if (user.organization_id && topic.organization_id) {
        return topic.organization_id?._id === user.organization_id || 
               topic.organization_id === user.organization_id;
      }
    }
  }
  
  // Estudiante solo ve temas aprobados
  if (user.role === 'estudiante') {
    if (topic.status !== 'approved') return false;
    
    // Temas públicos
    if (topic.visibility === 'public') return true;
    
    // Temas de su organización
    if (user.organization_id && topic.organization_id) {
      return topic.organization_id?._id === user.organization_id || 
             topic.organization_id === user.organization_id;
    }
  }
  
  return false;
};

/**
 * Verifica si el usuario puede archivar un tema
 */
export const canArchiveTopic = (user, topic) => {
  if (!user || !topic) return false;
  
  // Solo admin y super admin pueden archivar
  if (user.is_super) return true;
  
  if (user.role === 'admin') {
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  return false;
};

/**
 * Verifica si el usuario puede editar el contenido de un tema
 * (agregar/editar bloques de contenido)
 */
export const canEditContent = (user, topic) => {
  if (!user || !topic) return false;
  
  // Super admin puede editar contenido siempre
  if (user.is_super) return true;
  
  // Si el tema está aprobado, solo admin/super pueden editar contenido
  if (topic.status === 'approved') {
    if (user.role === 'admin') {
      return topic.organization_id?._id === user.organization_id || 
             topic.organization_id === user.organization_id;
    }
    return false;
  }
  
  // Admin puede editar contenido de temas de su organización
  if (user.role === 'admin') {
    return topic.organization_id?._id === user.organization_id || 
           topic.organization_id === user.organization_id;
  }
  
  // Docente solo puede editar contenido de sus temas en draft o rejected
  if (user.role === 'docente') {
    const isOwner = topic.created_by?._id === user._id || 
                    topic.created_by === user._id;
    const isEditable = ['draft', 'rejected'].includes(topic.status);
    return isOwner && isEditable;
  }
  
  return false;
};

/**
 * Verifica si el usuario puede agregar/editar cuestionarios
 */
export const canEditQuizzes = (user, topic) => {
  // Misma lógica que editar contenido
  return canEditContent(user, topic);
};

/**
 * Obtiene las acciones disponibles para un tema según el usuario
 */
export const getAvailableActions = (user, topic) => {
  if (!user || !topic) return [];
  
  const actions = [];
  
  // Ver detalle (siempre disponible si puede ver el tema)
  if (canViewTopic(user, topic)) {
    actions.push('view');
  }
  
  // Editar
  if (canEditTopic(user, topic)) {
    actions.push('edit');
  }
  
  // Eliminar
  if (canDeleteTopic(user, topic)) {
    actions.push('delete');
  }
  
  // Enviar a revisión
  if (canSubmitForReview(user, topic)) {
    actions.push('submit-review');
  }
  
  // Aprobar/Rechazar
  if (canReviewTopic(user, topic) && topic.status === 'pending_review') {
    actions.push('approve');
    actions.push('reject');
  }
  
  // Archivar
  if (canArchiveTopic(user, topic)) {
    actions.push('archive');
  }
  
  return actions;
};

/**
 * Obtiene el badge de estado con color
 */
export const getStatusBadge = (status) => {
  const badges = {
    draft: { text: 'Borrador', color: '#95a5a6', icon: '📝' },
    pending_review: { text: 'En Revisión', color: '#f39c12', icon: '⏳' },
    approved: { text: 'Aprobado', color: '#27ae60', icon: '✅' },
    rejected: { text: 'Rechazado', color: '#e74c3c', icon: '❌' },
    changes_requested: { text: 'Cambios Solicitados', color: '#e67e22', icon: '🔄' },
    archived: { text: 'Archivado', color: '#7f8c8d', icon: '📦' }
  };
  
  return badges[status] || { text: status, color: '#95a5a6', icon: '❓' };
};

/**
 * Obtiene el badge de visibilidad
 */
export const getVisibilityBadge = (visibility) => {
  const badges = {
    public: { text: 'Público', icon: '🌐' },
    organization: { text: 'Organización', icon: '🏢' },
    private: { text: 'Privado', icon: '🔒' }
  };
  
  return badges[visibility] || { text: visibility, icon: '❓' };
};

/**
 * Filtra temas según permisos del usuario
 */
export const filterTopicsByPermissions = (topics, user) => {
  if (!topics || !Array.isArray(topics)) return [];
  if (!user) {
    // Usuario no autenticado: solo temas públicos aprobados
    return topics.filter(t => t.status === 'approved' && t.visibility === 'public');
  }
  
  return topics.filter(topic => canViewTopic(user, topic));
};

/**
 * Determina el mensaje de ayuda según el rol
 */
export const getHelpMessage = (user) => {
  if (!user) return 'Inicia sesión para ver más contenido';
  
  const messages = {
    estudiante: 'Explora los temas aprobados de tu organización y públicos',
    docente: 'Crea y gestiona tus propios temas educativos',
    revisor: 'Revisa y aprueba temas de tu organización',
    admin: 'Gestiona todos los temas de tu organización'
  };
  
  if (user.is_super) return 'Gestiona todos los temas del sistema';
  
  return messages[user.role] || 'Explora el contenido disponible';
};

export default {
  canCreateTopic,
  canEditTopic,
  canDeleteTopic,
  canReviewTopic,
  canSubmitForReview,
  canViewTopic,
  canArchiveTopic,
  canEditContent,
  canEditQuizzes,
  getAvailableActions,
  getStatusBadge,
  getVisibilityBadge,
  filterTopicsByPermissions,
  getHelpMessage
};

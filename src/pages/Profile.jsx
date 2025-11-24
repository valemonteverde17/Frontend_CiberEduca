import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Estado para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.user_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Estado para estadísticas (estudiantes)
  const [stats, setStats] = useState(null);
  const [scores, setScores] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Estado para estadísticas de admin
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'estudiante') {
      loadStudentData();
    } else if (user.role === 'admin') {
      loadAdminData();
    }
  }, [user, navigate]);

  const loadStudentData = async () => {
    setLoadingStats(true);
    try {
      // Cargar estadísticas
      const statsRes = await axios.get(`/scores/stats/${user._id}`);
      setStats(statsRes.data);

      // Cargar puntajes
      const scoresRes = await axios.get(`/scores/user/${user._id}`);
      setScores(scoresRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadAdminData = async () => {
    setLoadingStats(true);
    try {
      const [usersRes, topicsRes] = await Promise.all([
        axios.get('/users'),
        axios.get('/topics?all=true')
      ]);
      
      const users = usersRes.data;
      const topics = topicsRes.data;
      
      setAdminStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        pendingUsers: users.filter(u => u.status === 'pending').length,
        totalTopics: topics.length,
        approvedTopics: topics.filter(t => t.status === 'approved').length,
        pendingTopics: topics.filter(t => t.status === 'pending_approval').length,
        draftTopics: topics.filter(t => t.status === 'draft').length,
        students: users.filter(u => u.role === 'estudiante').length,
        teachers: users.filter(u => u.role === 'docente').length,
      });
    } catch (err) {
      console.error('Error al cargar datos de admin:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validar username
    if (newUsername.trim().length < 3) {
      setMessage('❌ El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    // Si se quiere cambiar contraseña
    if (newPassword) {
      if (!validatePassword(newPassword)) {
        setMessage('❌ La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales');
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage('❌ Las contraseñas no coinciden');
        return;
      }
    }

    try {
      const updateData = {
        user_name: newUsername,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const res = await axios.patch(`/users/${user._id}`, updateData);
      
      // Actualizar el contexto de usuario
      setUser({ ...user, user_name: res.data.user_name });
      
      setMessage('✓ Perfil actualizado correctamente');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al actualizar el perfil');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.user_name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.user_name}</h1>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'admin' ? '🛡️ Administrador' : user.role === 'docente' ? '👨‍🏫 Docente' : '👨‍🎓 Estudiante'}
            </span>
          </div>
        </div>

        {/* Sección de edición de perfil */}
        <div className="profile-section">
          <div className="section-header">
            <h2>⚙️ Configuración de Cuenta</h2>
            {!isEditing && (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="edit-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nuevo nombre de usuario"
                  required
                />
                <small>Mínimo 3 caracteres</small>
              </div>

              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <small>
                  Debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales
                </small>
              </div>

              {newPassword && (
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setIsEditing(false);
                  setNewUsername(user.user_name);
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage('');
                }}>
                  ✖ Cancelar
                </button>
                <button type="submit" className="btn-save">
                  ✓ Guardar Cambios
                </button>
              </div>

              {message && (
                <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Usuario:</span>
                <span className="detail-value">{user.user_name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rol:</span>
                <span className="detail-value">{user.role === 'docente' ? 'Docente' : 'Estudiante'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas para estudiantes */}
        {user.role === 'estudiante' && (
          <>
            <div className="profile-section">
              <h2>📊 Mis Estadísticas</h2>
              {loadingStats ? (
                <div className="loading">Cargando estadísticas...</div>
              ) : stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{stats.total_quizzes}</div>
                    <div className="stat-label">Quizzes Completados</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{stats.average_score}%</div>
                    <div className="stat-label">Promedio General</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{stats.highest_score}%</div>
                    <div className="stat-label">Mejor Puntaje</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{stats.total_correct}/{stats.total_questions}</div>
                    <div className="stat-label">Respuestas Correctas</div>
                  </div>
                </div>
              ) : (
                <div className="no-stats">
                  <p>📚 Aún no has completado ningún quiz.</p>
                  <button className="btn-start" onClick={() => navigate('/quizzes')}>
                    Comenzar Ahora
                  </button>
                </div>
              )}
            </div>

            {/* Historial de quizzes */}
            {scores.length > 0 && (
              <div className="profile-section">
                <h2>📜 Historial de Quizzes</h2>
                <div className="scores-list">
                  {scores.map((score) => (
                    <div key={score._id} className="score-card">
                      <div className="score-header">
                        <div className="score-title">
                          <h3>{score.quiz_set_id?.quiz_name || 'Quiz'}</h3>
                          <span className="score-topic">{score.topic_id?.topic_name || 'Tema'}</span>
                        </div>
                        <div 
                          className="score-badge"
                          style={{ background: getScoreColor(score.score) }}
                        >
                          {score.score}%
                        </div>
                      </div>
                      <div className="score-details">
                        <div className="score-detail">
                          <span className="detail-icon">✅</span>
                          <span>{score.correct_answers}/{score.total_questions} correctas</span>
                        </div>
                        <div className="score-detail">
                          <span className="detail-icon">⏱️</span>
                          <span>{formatTime(score.time_taken)}</span>
                        </div>
                        <div className="score-detail">
                          <span className="detail-icon">📅</span>
                          <span>{formatDate(score.completed_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para ver rankings */}
            <div className="profile-section">
              <button className="btn-rankings" onClick={() => navigate('/rankings')}>
                🏆 Ver Rankings Globales
              </button>
            </div>
          </>
        )}

        {/* Estadísticas para admin */}
        {user.role === 'admin' && (
          <>
            <div className="profile-section">
              <h2>📊 Estadísticas del Sistema</h2>
              {loadingStats ? (
                <div className="loading">Cargando estadísticas...</div>
              ) : adminStats ? (
                <div className="stats-grid">
                  <div className="stat-card admin-stat">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{adminStats.totalUsers}</div>
                    <div className="stat-label">Total Usuarios</div>
                    <div className="stat-detail">
                      ✅ {adminStats.activeUsers} activos • ⏳ {adminStats.pendingUsers} pendientes
                    </div>
                  </div>
                  <div className="stat-card admin-stat">
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{adminStats.totalTopics}</div>
                    <div className="stat-label">Total Temas</div>
                    <div className="stat-detail">
                      ✅ {adminStats.approvedTopics} aprobados • 📝 {adminStats.draftTopics} borradores
                    </div>
                  </div>
                  <div className="stat-card admin-stat">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-value">{adminStats.students}</div>
                    <div className="stat-label">Estudiantes</div>
                  </div>
                  <div className="stat-card admin-stat">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-value">{adminStats.teachers}</div>
                    <div className="stat-label">Docentes</div>
                  </div>
                  <div className="stat-card admin-stat">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{adminStats.pendingTopics}</div>
                    <div className="stat-label">Temas Pendientes</div>
                  </div>
                </div>
              ) : (
                <div className="no-stats">
                  <p>📊 No se pudieron cargar las estadísticas</p>
                </div>
              )}
            </div>

            <div className="profile-section">
              <h2>🛡️ Panel de Administrador</h2>
              <div className="teacher-actions">
                <button className="action-btn admin-btn" onClick={() => navigate('/admin/dashboard')}>
                  ⚡ Dashboard Admin
                </button>
                <button className="action-btn admin-btn" onClick={() => navigate('/admin/users')}>
                  👥 Gestión de Usuarios
                </button>
                <button className="action-btn admin-btn" onClick={() => navigate('/admin/content')}>
                  📚 Gestión de Contenido
                </button>
                <button className="action-btn admin-btn" onClick={() => navigate('/topics')}>
                  📖 Ver Todos los Temas
                </button>
                <button className="action-btn admin-btn" onClick={() => navigate('/rankings')}>
                  🏆 Rankings de Estudiantes
                </button>
              </div>
            </div>
          </>
        )}

        {/* Información adicional para docentes */}
        {user.role === 'docente' && (
          <div className="profile-section">
            <h2>👨‍🏫 Panel de Docente</h2>
            <div className="teacher-actions">
              <button className="action-btn" onClick={() => navigate('/topics')}>
                📚 Gestionar Temas
              </button>
              <button className="action-btn" onClick={() => navigate('/manage-hangman')}>
                🎯 Gestionar Ahorcado
              </button>
              <button className="action-btn" onClick={() => navigate('/manage-memorama')}>
                🧠 Gestionar Memorama
              </button>
              <button className="action-btn" onClick={() => navigate('/rankings')}>
                🏆 Ver Rankings de Estudiantes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // No autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuario pendiente de aprobación
  if (user.status === 'pending') {
    return (
      <div className="pending-approval-page">
        <div className="pending-approval-box">
          <div className="pending-icon">⏳</div>
          <h2>Cuenta Pendiente de Aprobación</h2>
          <p>Tu cuenta está siendo revisada por un administrador.</p>
          <p>Recibirás una notificación cuando sea aprobada.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-back-login">
            ← Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Usuario suspendido
  if (user.status === 'suspended') {
    return (
      <div className="pending-approval-page">
        <div className="pending-approval-box">
          <div className="pending-icon">🚫</div>
          <h2>Cuenta Suspendida</h2>
          <p>Tu cuenta ha sido suspendida temporalmente.</p>
          <p>Contacta al administrador para más información.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-back-login">
            ← Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Usuario rechazado
  if (user.status === 'rejected') {
    return (
      <div className="pending-approval-page">
        <div className="pending-approval-box">
          <div className="pending-icon">❌</div>
          <h2>Solicitud Rechazada</h2>
          <p>Tu solicitud de registro fue rechazada.</p>
          <p>Contacta al administrador para más información.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-back-login">
            ← Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Validar roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/topics" replace />;
  }

  return children;
}

import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="legal-header">
          <h1>🔒 Política de Privacidad</h1>
          <p className="last-updated">Última actualización: Noviembre 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Información que Recopilamos</h2>
            <p>
              En CiberEduca, nos comprometemos a proteger tu privacidad. Recopilamos la siguiente información:
            </p>
            <ul>
              <li><strong>Información de cuenta:</strong> Nombre de usuario y contraseña (encriptada)</li>
              <li><strong>Información de perfil:</strong> Rol (estudiante/docente) y estado de cuenta</li>
              <li><strong>Datos de uso:</strong> Progreso en temas, resultados de quizzes y juegos</li>
              <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, y datos de sesión</li>
            </ul>
          </section>

          <section>
            <h2>2. Uso de la Información</h2>
            <p>Utilizamos tu información para:</p>
            <ul>
              <li>Proporcionar y mantener nuestros servicios educativos</li>
              <li>Personalizar tu experiencia de aprendizaje</li>
              <li>Generar estadísticas y rankings de desempeño</li>
              <li>Comunicarnos contigo sobre tu cuenta y actualizaciones del servicio</li>
              <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
              <li>Garantizar la seguridad y prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h2>3. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
            </p>
            <ul>
              <li>Encriptación de contraseñas mediante bcrypt</li>
              <li>Autenticación basada en tokens JWT</li>
              <li>Conexiones seguras mediante HTTPS</li>
              <li>Acceso restringido a datos personales</li>
              <li>Auditorías regulares de seguridad</li>
            </ul>
          </section>

          <section>
            <h2>4. Compartir Información</h2>
            <p>
              No vendemos ni compartimos tu información personal con terceros, excepto en los siguientes casos:
            </p>
            <ul>
              <li>Cuando sea requerido por ley o proceso legal</li>
              <li>Para proteger nuestros derechos, propiedad o seguridad</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section>
            <h2>5. Retención de Datos</h2>
            <p>
              Conservamos tu información personal mientras tu cuenta esté activa o según sea necesario 
              para proporcionarte servicios. Puedes solicitar la eliminación de tu cuenta contactando 
              a un administrador.
            </p>
          </section>

          <section>
            <h2>6. Tus Derechos</h2>
            <p>Tienes derecho a:</p>
            <ul>
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tu cuenta</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Exportar tus datos en formato legible</li>
            </ul>
          </section>

          <section>
            <h2>7. Menores de Edad</h2>
            <p>
              Nuestro servicio está diseñado para uso educativo. Si eres menor de 18 años, 
              debes contar con el consentimiento de tus padres o tutores para usar la plataforma.
            </p>
          </section>

          <section>
            <h2>8. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
              sobre cambios significativos publicando la nueva política en esta página y 
              actualizando la fecha de "última actualización".
            </p>
          </section>

          <section>
            <h2>9. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad, puedes contactar a los 
              administradores de la plataforma a través de tu cuenta.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

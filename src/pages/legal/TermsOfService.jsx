import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="legal-header">
          <h1>📜 Términos y Condiciones de Uso</h1>
          <p className="last-updated">Última actualización: Noviembre 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar CiberEduca, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2>2. Descripción del Servicio</h2>
            <p>
              CiberEduca es una plataforma educativa en línea que proporciona:
            </p>
            <ul>
              <li>Contenido educativo sobre ciberseguridad y tecnología</li>
              <li>Quizzes y evaluaciones interactivas</li>
              <li>Juegos educativos (Ahorcado, Memorama)</li>
              <li>Sistema de rankings y seguimiento de progreso</li>
              <li>Herramientas para docentes y estudiantes</li>
            </ul>
          </section>

          <section>
            <h2>3. Registro y Cuenta de Usuario</h2>
            <p>Para utilizar CiberEduca, debes:</p>
            <ul>
              <li>Proporcionar información precisa y completa durante el registro</li>
              <li>Mantener la seguridad de tu contraseña</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
              <li>Ser responsable de todas las actividades realizadas bajo tu cuenta</li>
              <li>Esperar la aprobación de un administrador para activar tu cuenta</li>
            </ul>
          </section>

          <section>
            <h2>4. Uso Aceptable</h2>
            <p>Te comprometes a NO:</p>
            <ul>
              <li>Usar la plataforma para fines ilegales o no autorizados</li>
              <li>Intentar obtener acceso no autorizado a sistemas o datos</li>
              <li>Interferir con el funcionamiento normal de la plataforma</li>
              <li>Compartir contenido ofensivo, difamatorio o inapropiado</li>
              <li>Copiar, modificar o distribuir el contenido sin autorización</li>
              <li>Usar bots, scripts o herramientas automatizadas no autorizadas</li>
              <li>Hacerse pasar por otra persona o entidad</li>
            </ul>
          </section>

          <section>
            <h2>5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de CiberEduca, incluyendo textos, gráficos, logos, código y software, 
              es propiedad de CiberEduca o sus licenciantes y está protegido por leyes de propiedad 
              intelectual. No puedes reproducir, distribuir o crear trabajos derivados sin permiso expreso.
            </p>
          </section>

          <section>
            <h2>6. Contenido del Usuario</h2>
            <p>
              Al crear contenido en la plataforma (quizzes, juegos, etc.), otorgas a CiberEduca 
              una licencia no exclusiva para usar, modificar y mostrar ese contenido dentro de la plataforma.
            </p>
          </section>

          <section>
            <h2>7. Roles y Permisos</h2>
            <h3>Estudiantes:</h3>
            <ul>
              <li>Acceso a contenido educativo y juegos</li>
              <li>Participación en quizzes y actividades</li>
              <li>Visualización de rankings y progreso personal</li>
            </ul>
            <h3>Docentes:</h3>
            <ul>
              <li>Todos los permisos de estudiante</li>
              <li>Creación y edición de quizzes</li>
              <li>Gestión de juegos educativos</li>
            </ul>
            <h3>Administradores:</h3>
            <ul>
              <li>Gestión completa de usuarios y contenido</li>
              <li>Aprobación de nuevas cuentas</li>
              <li>Acceso a estadísticas y auditorías</li>
            </ul>
          </section>

          <section>
            <h2>8. Suspensión y Terminación</h2>
            <p>
              Nos reservamos el derecho de suspender o terminar tu cuenta si:
            </p>
            <ul>
              <li>Violas estos términos y condiciones</li>
              <li>Usas la plataforma de manera fraudulenta o abusiva</li>
              <li>Tu cuenta permanece inactiva por un período prolongado</li>
              <li>Es necesario por razones de seguridad o legales</li>
            </ul>
          </section>

          <section>
            <h2>9. Limitación de Responsabilidad</h2>
            <p>
              CiberEduca se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables de:
            </p>
            <ul>
              <li>Interrupciones o errores en el servicio</li>
              <li>Pérdida de datos o contenido</li>
              <li>Daños indirectos o consecuentes</li>
              <li>Contenido de terceros o enlaces externos</li>
            </ul>
          </section>

          <section>
            <h2>10. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
              de la plataforma en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          <section>
            <h2>11. Cambios a los Términos</h2>
            <p>
              Podemos actualizar estos términos ocasionalmente. El uso continuado de la plataforma 
              después de los cambios constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2>12. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes aplicables en tu jurisdicción. Cualquier 
              disputa se resolverá en los tribunales competentes.
            </p>
          </section>

          <section>
            <h2>13. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contacta a los administradores de la plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

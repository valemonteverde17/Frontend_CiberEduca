import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function Terminos() {
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
              Al acceder y utilizar la plataforma CiberEduca (en adelante "la Plataforma"), usted acepta 
              estar sujeto a estos Términos y Condiciones de Uso, así como a todas las leyes y regulaciones 
              aplicables en los Estados Unidos Mexicanos. Si no está de acuerdo con alguna parte de estos 
              términos, no debe utilizar la Plataforma.
            </p>
            <p>
              Estos términos constituyen un acuerdo legal vinculante entre usted (el "Usuario") y CiberEduca 
              (el "Prestador del Servicio"), conforme a lo establecido en el Código Civil Federal y la Ley 
              Federal de Protección al Consumidor.
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
            <h2>5. Propiedad Intelectual y Derechos de Autor</h2>
            <p>
              Todo el contenido de la Plataforma, incluyendo pero no limitándose a textos, gráficos, logos, 
              interfaces, código fuente, diseños y software, está protegido por la Ley Federal del Derecho 
              de Autor y tratados internacionales de propiedad intelectual.
            </p>
            <p>
              El software de la Plataforma se distribuye bajo la <strong>Licencia MIT</strong>, lo que permite 
              su uso, copia, modificación y distribución bajo los términos establecidos en dicha licencia. 
              Sin embargo, el contenido educativo, marcas, logos y materiales didácticos son propiedad exclusiva 
              de CiberEduca y no pueden ser reproducidos sin autorización expresa.
            </p>
            <p>
              Cualquier uso no autorizado del contenido protegido constituirá una violación a los derechos de 
              autor y podrá ser sancionado conforme a la legislación aplicable.
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
              En cumplimiento con el artículo 1915 del Código Civil Federal, CiberEduca no será responsable por:
            </p>
            <ul>
              <li>Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor</li>
              <li>Pérdida de datos derivada de fallas técnicas ajenas a nuestro control</li>
              <li>Daños indirectos, incidentales o consecuentes derivados del uso de la Plataforma</li>
              <li>Contenido de terceros, enlaces externos o servicios de terceros integrados</li>
              <li>Decisiones tomadas con base en el contenido educativo proporcionado</li>
            </ul>
            <p>
              La Plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio 
              sea ininterrumpido, seguro o libre de errores. El Usuario acepta utilizar la Plataforma bajo su 
              propio riesgo.
            </p>
            <p>
              Sin perjuicio de lo anterior, CiberEduca hará sus mejores esfuerzos para mantener la disponibilidad 
              y seguridad de la Plataforma.
            </p>
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
            <h2>12. Legislación Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de los Estados 
              Unidos Mexicanos, particularmente:
            </p>
            <ul>
              <li>Código Civil Federal</li>
              <li>Ley Federal de Protección al Consumidor</li>
              <li>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</li>
              <li>Ley Federal del Derecho de Autor</li>
              <li>Código de Comercio</li>
            </ul>
            <p>
              Para cualquier controversia o reclamación derivada de estos términos, las partes se someten 
              expresamente a la jurisdicción de los tribunales competentes de México, renunciando a cualquier 
              otra jurisdicción que pudiera corresponderles por razón de su domicilio presente o futuro.
            </p>
          </section>

          <section>
            <h2>13. Derechos del Consumidor</h2>
            <p>
              En cumplimiento con la Ley Federal de Protección al Consumidor, usted tiene derecho a:
            </p>
            <ul>
              <li>Recibir información clara y veraz sobre los servicios ofrecidos</li>
              <li>Presentar quejas y reclamaciones ante la Procuraduría Federal del Consumidor (PROFECO)</li>
              <li>Solicitar la devolución o bonificación en caso de servicios no prestados conforme a lo ofrecido</li>
              <li>Recibir comprobantes de las transacciones realizadas</li>
            </ul>
            <p>
              Para mayor información sobre sus derechos como consumidor, visite: <strong>www.profeco.gob.mx</strong>
            </p>
          </section>

          <section>
            <h2>14. Contacto y Atención al Usuario</h2>
            <p>
              Para preguntas, comentarios, quejas o aclaraciones sobre estos Términos y Condiciones, 
              puede contactar a los administradores de la Plataforma a través de los medios de contacto 
              disponibles en su cuenta de usuario.
            </p>
            <p>
              Nos comprometemos a responder sus solicitudes en un plazo no mayor a 5 días hábiles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function Datos() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="legal-header">
          <h1>🍪 Política de Cookies y Almacenamiento de Datos</h1>
          <p className="last-updated">Última actualización: Noviembre 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
              visitas un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen 
              de manera más eficiente y proporcionen información a los propietarios del sitio.
            </p>
          </section>

          <section>
            <h2>2. Marco Legal Aplicable</h2>
            <p>
              Esta política se emite en cumplimiento con:
            </p>
            <ul>
              <li><strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong></li>
              <li><strong>Lineamientos del Aviso de Privacidad</strong> emitidos por el INAI</li>
              <li><strong>Reglamento de la LFPDPPP</strong></li>
            </ul>
            <p>
              En México, el uso de cookies y tecnologías similares está regulado por la LFPDPPP cuando 
              implican el tratamiento de datos personales.
            </p>
          </section>

          <section>
            <h2>3. Uso de Cookies y Almacenamiento Local en CiberEduca</h2>
            <p>
              CiberEduca utiliza principalmente <strong>almacenamiento local (localStorage)</strong> en 
              lugar de cookies tradicionales para gestionar la autenticación y preferencias del usuario. 
              Esta tecnología es similar a las cookies pero ofrece mayor capacidad de almacenamiento y 
              mejor rendimiento.
            </p>
            <p>
              Conforme a la LFPDPPP, le informamos que estos mecanismos de almacenamiento procesan datos 
              personales necesarios para la prestación del servicio educativo.
            </p>
          </section>

          <section>
            <h2>4. Tipos de Datos Almacenados</h2>
            
            <h3>4.1 Datos de Autenticación (Estrictamente Necesarios)</h3>
            <p>
              Conforme al artículo 10 de la LFPDPPP, estos datos son necesarios para la relación jurídica 
              entre el titular y el responsable:
            </p>
            <ul>
              <li><strong>Token de autenticación (JWT):</strong> Para mantener tu sesión activa y segura</li>
              <li><strong>Información de usuario:</strong> ID, nombre de usuario y rol educativo</li>
              <li><strong>Estado de sesión:</strong> Para recordar que has iniciado sesión</li>
            </ul>
            <p className="cookie-note">
              ⚠️ Estos datos son <strong>estrictamente necesarios</strong> para el funcionamiento 
              de la Plataforma y no pueden ser desactivados sin impedir el acceso al servicio. Su uso 
              está justificado por la necesidad de cumplir con la relación contractual.
            </p>

            <h3>4.2 Preferencias de Usuario (Funcionales)</h3>
            <p>Datos opcionales que mejoran la experiencia del usuario:</p>
            <ul>
              <li>Configuraciones de interfaz</li>
              <li>Preferencias de visualización</li>
              <li>Idioma seleccionado (si aplica)</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies de Terceros</h2>
            <p>
              Actualmente, CiberEduca <strong>NO utiliza cookies de terceros</strong> para análisis, 
              publicidad o seguimiento. Toda la información se almacena localmente en tu navegador 
              y solo se envía a nuestros servidores cuando es necesario para proporcionar el servicio.
            </p>
            <p>
              En caso de implementar cookies de terceros en el futuro, se actualizará esta política 
              y se solicitará su consentimiento conforme a la LFPDPPP.
            </p>
          </section>

          <section>
            <h2>6. Periodo de Conservación</h2>
            <p>
              Conforme al principio de temporalidad establecido en la LFPDPPP, los datos almacenados 
              se conservan por los siguientes periodos:
            </p>
            <ul>
              <li>
                <strong>Token de sesión:</strong> Expira automáticamente después de 24 horas de inactividad 
                o al cerrar sesión
              </li>
              <li>
                <strong>Datos de usuario:</strong> Se mantienen hasta que cierres sesión manualmente o 
                solicites su eliminación
              </li>
              <li>
                <strong>Preferencias:</strong> Se mantienen hasta que las elimines manualmente o borres 
                los datos del navegador
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Ejercicio de Derechos ARCO sobre Datos Almacenados</h2>
            <p>
              En cumplimiento con los artículos 22 a 29 de la LFPDPPP, usted puede ejercer sus derechos 
              de Acceso, Rectificación, Cancelación y Oposición (ARCO) sobre los datos almacenados.
            </p>
            
            <h3>7.1 Eliminar Datos Almacenados</h3>
            <p>Puede eliminar los datos almacenados de las siguientes maneras:</p>
            <ul>
              <li><strong>Cerrar sesión:</strong> Elimina automáticamente tu token de autenticación</li>
              <li><strong>Borrar datos del navegador:</strong> Elimina todo el almacenamiento local</li>
              <li><strong>Modo incógnito:</strong> Los datos se eliminan al cerrar la ventana</li>
              <li><strong>Solicitud de cancelación:</strong> Contactar a los administradores para eliminar 
              permanentemente su cuenta y datos asociados</li>
            </ul>

            <h3>7.2 Instrucciones por Navegador</h3>
            <div className="browser-instructions">
              <div className="browser-item">
                <strong>Chrome:</strong>
                <p>Configuración → Privacidad y seguridad → Borrar datos de navegación → Cookies y otros datos de sitios</p>
              </div>
              <div className="browser-item">
                <strong>Firefox:</strong>
                <p>Opciones → Privacidad y seguridad → Cookies y datos del sitio → Limpiar datos</p>
              </div>
              <div className="browser-item">
                <strong>Safari:</strong>
                <p>Preferencias → Privacidad → Gestionar datos de sitios web</p>
              </div>
              <div className="browser-item">
                <strong>Edge:</strong>
                <p>Configuración → Privacidad, búsqueda y servicios → Borrar datos de exploración</p>
              </div>
            </div>
          </section>

          <section>
            <h2>8. Impacto de Deshabilitar el Almacenamiento</h2>
            <p>
              Le informamos que si deshabilita el almacenamiento local o elimina los datos almacenados:
            </p>
            <ul>
              <li>❌ No podrá mantener su sesión iniciada</li>
              <li>❌ Tendrá que iniciar sesión cada vez que visite la Plataforma</li>
              <li>❌ Se perderán sus preferencias de interfaz</li>
              <li>❌ La Plataforma no funcionará correctamente</li>
            </ul>
            <p>
              Esto se debe a que estos mecanismos son estrictamente necesarios para la prestación del 
              servicio educativo, conforme a lo establecido en el artículo 10 de la LFPDPPP.
            </p>
          </section>

          <section>
            <h2>9. Medidas de Seguridad</h2>
            <p>
              En cumplimiento con el artículo 19 de la LFPDPPP, implementamos medidas de seguridad 
              administrativas, técnicas y físicas para proteger los datos almacenados:
            </p>
            <ul>
              <li>Tokens JWT con firma criptográfica y algoritmos seguros</li>
              <li>Expiración automática de sesiones por inactividad</li>
              <li>Comunicación encriptada mediante protocolo HTTPS/TLS</li>
              <li>No almacenamos contraseñas en texto plano en el navegador</li>
              <li>Validación de tokens en cada petición al servidor</li>
              <li>Monitoreo de accesos y auditoría de seguridad</li>
            </ul>
          </section>

          <section>
            <h2>10. Actualizaciones de esta Política</h2>
            <p>
              CiberEduca se reserva el derecho de modificar esta política en cualquier momento para 
              cumplir con cambios legislativos o mejoras en el servicio. Si implementamos nuevas 
              tecnologías de seguimiento o cookies en el futuro, actualizaremos esta política y le 
              notificaremos sobre los cambios significativos.
            </p>
            <p>
              Las modificaciones estarán disponibles en esta página con la fecha de actualización correspondiente.
            </p>
          </section>

          <section>
            <h2>11. Consentimiento y Base Legal</h2>
            <p>
              Al utilizar CiberEduca, usted otorga su consentimiento para el uso del almacenamiento local 
              según se describe en esta política. El tratamiento de datos mediante estos mecanismos se 
              fundamenta en:
            </p>
            <ul>
              <li><strong>Artículo 10 de la LFPDPPP:</strong> Datos necesarios para la relación jurídica 
              entre el titular y el responsable</li>
              <li><strong>Consentimiento tácito:</strong> Al aceptar los Términos y Condiciones y utilizar 
              la Plataforma</li>
            </ul>
            <p>
              Si no está de acuerdo con el uso de estos mecanismos, lamentablemente no podrá utilizar 
              la Plataforma, ya que son esenciales para su funcionamiento y seguridad.
            </p>
          </section>

          <section>
            <h2>12. Contacto y Ejercicio de Derechos</h2>
            <p>
              Para ejercer sus derechos ARCO, revocar su consentimiento, o realizar consultas sobre 
              esta política de cookies, puede contactar a los administradores de la Plataforma.
            </p>
            <p>
              En caso de considerar que sus derechos han sido vulnerados, puede acudir al Instituto 
              Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI): 
              <strong>www.inai.org.mx</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

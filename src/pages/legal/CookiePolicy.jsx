import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="legal-header">
          <h1>🍪 Política de Cookies</h1>
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
            <h2>2. Uso de Cookies en CiberEduca</h2>
            <p>
              CiberEduca utiliza principalmente <strong>almacenamiento local (localStorage)</strong> en 
              lugar de cookies tradicionales para gestionar la autenticación y preferencias del usuario. 
              Esta tecnología es similar a las cookies pero ofrece mayor capacidad de almacenamiento y 
              mejor rendimiento.
            </p>
          </section>

          <section>
            <h2>3. Tipos de Datos Almacenados</h2>
            
            <h3>3.1 Datos de Autenticación (Esenciales)</h3>
            <p>Almacenamos la siguiente información en tu navegador:</p>
            <ul>
              <li><strong>Token de autenticación (JWT):</strong> Para mantener tu sesión activa</li>
              <li><strong>Información de usuario:</strong> ID, nombre de usuario y rol</li>
              <li><strong>Estado de sesión:</strong> Para recordar que has iniciado sesión</li>
            </ul>
            <p className="cookie-note">
              ⚠️ Estos datos son <strong>estrictamente necesarios</strong> para el funcionamiento 
              de la plataforma y no pueden ser desactivados.
            </p>

            <h3>3.2 Preferencias de Usuario (Funcionales)</h3>
            <ul>
              <li>Configuraciones de interfaz</li>
              <li>Preferencias de visualización</li>
              <li>Idioma seleccionado (si aplica)</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies de Terceros</h2>
            <p>
              Actualmente, CiberEduca <strong>NO utiliza cookies de terceros</strong> para análisis, 
              publicidad o seguimiento. Toda la información se almacena localmente en tu navegador 
              y solo se envía a nuestros servidores cuando es necesario para proporcionar el servicio.
            </p>
          </section>

          <section>
            <h2>5. Duración del Almacenamiento</h2>
            <ul>
              <li>
                <strong>Token de sesión:</strong> Expira automáticamente después de un período de 
                inactividad (generalmente 24 horas)
              </li>
              <li>
                <strong>Datos de usuario:</strong> Se mantienen hasta que cierres sesión manualmente
              </li>
              <li>
                <strong>Preferencias:</strong> Se mantienen indefinidamente hasta que las elimines
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Gestión de Cookies y Almacenamiento Local</h2>
            
            <h3>6.1 Eliminar Datos Almacenados</h3>
            <p>Puedes eliminar los datos almacenados de las siguientes maneras:</p>
            <ul>
              <li><strong>Cerrar sesión:</strong> Elimina automáticamente tu token de autenticación</li>
              <li><strong>Borrar datos del navegador:</strong> Elimina todo el almacenamiento local</li>
              <li><strong>Modo incógnito:</strong> Los datos se eliminan al cerrar la ventana</li>
            </ul>

            <h3>6.2 Instrucciones por Navegador</h3>
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
            <h2>7. Impacto de Deshabilitar el Almacenamiento</h2>
            <p>
              Si deshabilitas el almacenamiento local o eliminas los datos almacenados:
            </p>
            <ul>
              <li>❌ No podrás mantener tu sesión iniciada</li>
              <li>❌ Tendrás que iniciar sesión cada vez que visites la plataforma</li>
              <li>❌ Se perderán tus preferencias de interfaz</li>
              <li>❌ La plataforma no funcionará correctamente</li>
            </ul>
          </section>

          <section>
            <h2>8. Seguridad</h2>
            <p>
              Implementamos las siguientes medidas de seguridad para proteger los datos almacenados:
            </p>
            <ul>
              <li>Tokens JWT con firma criptográfica</li>
              <li>Expiración automática de sesiones</li>
              <li>Comunicación encriptada mediante HTTPS</li>
              <li>No almacenamos contraseñas en el navegador</li>
              <li>Validación de tokens en cada petición al servidor</li>
            </ul>
          </section>

          <section>
            <h2>9. Actualizaciones de esta Política</h2>
            <p>
              Si implementamos nuevas tecnologías de seguimiento o cookies en el futuro, 
              actualizaremos esta política y te notificaremos sobre los cambios significativos.
            </p>
          </section>

          <section>
            <h2>10. Consentimiento</h2>
            <p>
              Al usar CiberEduca, consientes el uso del almacenamiento local según se describe 
              en esta política. Si no estás de acuerdo, lamentablemente no podrás utilizar la plataforma, 
              ya que estos mecanismos son esenciales para su funcionamiento.
            </p>
          </section>

          <section>
            <h2>11. Preguntas</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, contacta a los administradores 
              de la plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

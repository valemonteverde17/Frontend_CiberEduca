import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function Privacidad() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="legal-header">
          <h1>🔒 Aviso de Privacidad</h1>
          <p className="last-updated">Última actualización: Noviembre 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Identidad y Domicilio del Responsable</h2>
            <p>
              <strong>CiberEduca</strong> es el responsable del tratamiento de sus datos personales. 
              Este Aviso de Privacidad se emite en cumplimiento con la Ley Federal de Protección de 
              Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.
            </p>
          </section>

          <section>
            <h2>2. Datos Personales que Recabamos</h2>
            <p>
              Para las finalidades descritas en este aviso de privacidad, recabamos los siguientes 
              datos personales:
            </p>
            <ul>
              <li><strong>Datos de identificación:</strong> Nombre de usuario</li>
              <li><strong>Datos de contacto:</strong> Información de cuenta y perfil educativo</li>
              <li><strong>Datos académicos:</strong> Rol (estudiante/docente), progreso en temas, resultados de evaluaciones</li>
              <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, datos de sesión</li>
            </ul>
            <p>
              <strong>No recabamos datos personales sensibles</strong> según lo establecido en el 
              artículo 3, fracción VI de la LFPDPPP.
            </p>
          </section>

          <section>
            <h2>3. Finalidades del Tratamiento</h2>
            <h3>Finalidades Primarias (necesarias para el servicio):</h3>
            <ul>
              <li>Proporcionar los servicios educativos de la plataforma</li>
              <li>Gestionar tu cuenta de usuario y autenticación</li>
              <li>Registrar y evaluar tu progreso académico</li>
              <li>Generar estadísticas y rankings de desempeño</li>
              <li>Cumplir con obligaciones derivadas de la relación jurídica entre el titular y el responsable</li>
            </ul>
            <h3>Finalidades Secundarias (no son necesarias pero mejoran el servicio):</h3>
            <ul>
              <li>Comunicarte actualizaciones y mejoras del servicio</li>
              <li>Realizar análisis estadísticos y de mejora continua</li>
              <li>Desarrollar nuevas funcionalidades educativas</li>
            </ul>
            <p>
              Si no deseas que tus datos personales sean tratados para las finalidades secundarias, 
              puedes manifestarlo contactando a los administradores.
            </p>
          </section>

          <section>
            <h2>4. Medidas de Seguridad</h2>
            <p>
              CiberEduca ha implementado medidas de seguridad administrativas, técnicas y físicas 
              para proteger sus datos personales contra daño, pérdida, alteración, destrucción o 
              uso no autorizado:
            </p>
            <ul>
              <li>Encriptación de contraseñas mediante algoritmos bcrypt</li>
              <li>Autenticación mediante tokens JWT con firma criptográfica</li>
              <li>Comunicaciones protegidas mediante protocolo HTTPS/TLS</li>
              <li>Control de acceso basado en roles (RBAC)</li>
              <li>Auditorías de seguridad y monitoreo de accesos</li>
              <li>Políticas de respaldo y recuperación de información</li>
            </ul>
          </section>

          <section>
            <h2>5. Transferencias de Datos Personales</h2>
            <p>
              Sus datos personales <strong>no serán transferidos</strong> a terceros nacionales o 
              internacionales, salvo en los siguientes casos previstos por la LFPDPPP:
            </p>
            <ul>
              <li>Cuando sea requerido por autoridad competente mediante orden judicial o resolución administrativa</li>
              <li>Para proteger derechos o seguridad del responsable, usuarios o terceros</li>
              <li>Cuando exista una relación jurídica entre el responsable y el tercero</li>
              <li>Con su consentimiento expreso</li>
            </ul>
            <p>
              En caso de requerir realizar transferencias adicionales, se solicitará su consentimiento 
              conforme a lo establecido en la ley.
            </p>
          </section>

          <section>
            <h2>6. Periodo de Conservación</h2>
            <p>
              Sus datos personales serán conservados durante el tiempo necesario para cumplir con las 
              finalidades descritas en este aviso, y posteriormente durante los plazos legalmente exigibles 
              conforme a las disposiciones aplicables.
            </p>
            <p>
              Una vez cumplidas las finalidades del tratamiento y los plazos de conservación, sus datos 
              serán eliminados o bloqueados de nuestras bases de datos.
            </p>
          </section>

          <section>
            <h2>7. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a conocer qué datos personales tenemos, para qué los utilizamos y las 
              condiciones de uso (Acceso). Asimismo, es su derecho solicitar la corrección de su información 
              personal en caso de estar desactualizada, ser inexacta o incompleta (Rectificación); que la 
              eliminemos de nuestros registros cuando considere que no está siendo utilizada adecuadamente 
              (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
            </p>
            <p>
              Estos derechos se conocen como derechos ARCO y pueden ejercerse mediante solicitud dirigida a 
              los administradores de la plataforma, proporcionando:
            </p>
            <ul>
              <li>Nombre del titular y domicilio u otro medio para comunicar la respuesta</li>
              <li>Documentos que acrediten la identidad del titular</li>
              <li>Descripción clara y precisa de los datos respecto de los que busca ejercer alguno de los derechos ARCO</li>
              <li>Cualquier otro elemento que facilite la localización de los datos personales</li>
            </ul>
            <p>
              La respuesta a su solicitud se dará en un plazo máximo de 20 días hábiles contados desde la 
              fecha en que se recibió, y se hará efectiva dentro de los 15 días hábiles siguientes.
            </p>
          </section>

          <section>
            <h2>8. Revocación del Consentimiento</h2>
            <p>
              Usted puede revocar el consentimiento que nos ha otorgado para el tratamiento de sus datos 
              personales, contactando a los administradores de la plataforma. Sin embargo, es importante 
              que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el 
              uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir 
              tratando sus datos.
            </p>
          </section>

          <section>
            <h2>9. Menores de Edad</h2>
            <p>
              Esta plataforma está diseñada para uso educativo. En caso de tratarse de datos personales 
              de menores de edad, se requiere el consentimiento de los padres, tutores o representantes 
              legales, conforme a lo establecido en la LFPDPPP.
            </p>
          </section>

          <section>
            <h2>10. Modificaciones al Aviso de Privacidad</h2>
            <p>
              CiberEduca se reserva el derecho de efectuar modificaciones o actualizaciones al presente 
              Aviso de Privacidad en cualquier momento, para la atención de novedades legislativas, 
              políticas internas o nuevos requerimientos para la prestación de servicios.
            </p>
            <p>
              Estas modificaciones estarán disponibles en esta página, indicando la fecha de última 
              actualización. Es su responsabilidad revisar periódicamente este aviso.
            </p>
          </section>

          <section>
            <h2>11. Autoridad Competente</h2>
            <p>
              Si considera que su derecho a la protección de datos personales ha sido lesionado por 
              alguna conducta u omisión de nuestra parte, o presume alguna violación a las disposiciones 
              previstas en la LFPDPPP y demás ordenamientos aplicables, podrá interponer su inconformidad 
              o denuncia ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección 
              de Datos Personales (INAI).
            </p>
            <p>
              Para mayor información visite: <strong>www.inai.org.mx</strong>
            </p>
          </section>

          <section>
            <h2>12. Contacto</h2>
            <p>
              Para cualquier duda, comentario o solicitud relacionada con este Aviso de Privacidad o el 
              ejercicio de sus derechos ARCO, puede contactar a los administradores de la plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

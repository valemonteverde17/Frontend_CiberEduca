import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>CiberEduca</h4>
          <p>Plataforma educativa de ciberseguridad</p>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li>
              <Link to="/privacidad">Política de Privacidad</Link>
            </li>
            <li>
              <Link to="/terminos">Términos y Condiciones</Link>
            </li>
            <li>
              <Link to="/datos">Política de Datos</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Contacta a los administradores para más información</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} CiberEduca. Licenciado bajo{' '}
          <a 
            href="https://opensource.org/licenses/MIT" 
            target="_blank" 
            rel="noopener noreferrer"
            className="license-link"
          >
            Licencia MIT
          </a>
        </p>
      </div>
    </footer>
  );
}

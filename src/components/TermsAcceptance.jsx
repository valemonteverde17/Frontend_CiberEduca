import { Link } from 'react-router-dom';
import './TermsAcceptance.css';

export default function TermsAcceptance({ accepted, onAcceptChange }) {
  return (
    <div className="terms-acceptance">
      <label className="terms-checkbox-container">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptChange(e.target.checked)}
          className="terms-checkbox"
        />
        <span className="checkmark"></span>
        <span className="terms-text">
          He leído y acepto los{' '}
          <Link to="/terminos" target="_blank" className="terms-link">
            Términos y Condiciones
          </Link>
          , la{' '}
          <Link to="/privacidad" target="_blank" className="terms-link">
            Política de Privacidad
          </Link>
          {' '}y la{' '}
          <Link to="/datos" target="_blank" className="terms-link">
            Política de Datos
          </Link>
        </span>
      </label>
      
      {!accepted && (
        <p className="terms-hint">
          ⓘ Debes aceptar los términos para crear una cuenta
        </p>
      )}
    </div>
  );
}

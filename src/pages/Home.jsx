import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffefb5', // Fondo amarillo claro
      color: '#260d0d', // Texto oscuro
      padding: 'none'
    }}>


      {/* Contenido principal */}
      <div style={{ 
        marginTop: '-3rem' // Ajuste para centrar verticalmente
      }}>
        <h1 style={{ 
          fontSize: '3rem',
          marginBottom: '2rem',
          fontWeight: 'bold',
          color: '#260d0d'
        }}>
          Bienvenido a <span style={{ color: '#ff4000' }}>CiberEduca</span>
        </h1>

        {!user && (
          <div style={{ 
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center'
          }}>
            <Link to="/login">
              <button style={{ 
                padding: '0.8rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: '#319190',
                color: '#ffefb5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Entrar
              </button>
            </Link>
            <Link to="/signup">
              <button style={{ 
                padding: '0.8rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: '#ffefb5',
                color: '#319190',
                border: '#319190 2px solid',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Registrarse
              </button>
            </Link>
          </div>
        )}
      </div>

      {user && (
        <p style={{ marginTop: '2rem' }}>Ya estás autenticado como <strong>{user.user_name}</strong>.</p>
      )}
    </div>
  );
}
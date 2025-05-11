import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ResultTable() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`/results/user/${user._id}`).then(res => setResults(res.data));
    }
  }, [user]);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3>Historial de respuestas</h3>
      {results.length === 0 ? (
        <p>Aún no has respondido ningún quiz.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Tu respuesta</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {results.map(res => (
              <tr key={res._id}>
                <td>{res.quiz_id?.question || 'Pregunta eliminada'}</td>
                <td>{res.selectedAnswer}</td>
                <td>{res.isCorrect ? '✅ Correcto' : '❌ Incorrecto'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

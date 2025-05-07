import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function GlobalRanking() {
  const [ranking, setRanking] = useState([]);
  const [users, setUsers] = useState({}); // id -> nombre

  useEffect(() => {
    axios.get('/results/ranking/global').then(async res => {
      const rankingData = res.data;
      setRanking(rankingData);

      // Cargar nombres de usuarios por id
      const userResponses = await Promise.all(
        rankingData.map(r => axios.get(`/users/${r.user_id}`).catch(() => null))
      );

      const names = {};
      userResponses.forEach((res, i) => {
        if (res?.data) names[rankingData[i].user_id] = res.data.user_name;
      });

      setUsers(names);
    });
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3>🏆 Ranking Global</h3>
      {ranking.length === 0 ? (
        <p>No hay resultados disponibles aún.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Puesto</th>
              <th>Usuario</th>
              <th>Aciertos totales</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, i) => (
              <tr key={r.user_id}>
                <td>{i + 1}</td>
                <td>{users[r.user_id] || 'Usuario desconocido'}</td>
                <td>{r.correct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

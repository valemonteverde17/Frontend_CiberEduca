import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Topics() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      const res = await axios.get('/topics');
      setTopics(res.data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = async () => {
    const topic_name = prompt('Nombre del tema:');
    if (!topic_name) return;
    const description = prompt('Descripción:');
    if (!description || description.length < 10) return alert('Descripción demasiado corta');

    try {
      await axios.post('/topics', { topic_name, description });
      fetchTopics();
    } catch (err) {
      alert('Error al agregar tema');
    }
  };

  const handleEdit = async (topic) => {
    const newName = prompt('Nuevo nombre:', topic.topic_name);
    const newDesc = prompt('Nueva descripción:', topic.description);
    if (!newName || !newDesc) return;

    try {
      await axios.patch(`/topics/${topic._id}`, {
        topic_name: newName,
        description: newDesc,
      });
      fetchTopics();
    } catch (err) {
      alert('Error al editar tema');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Estás seguro de eliminar este tema?');
    if (!confirm) return;

    try {
      await axios.delete(`/topics/${id}`);
      fetchTopics();
    } catch (err) {
      alert('Error al eliminar tema');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Temas disponibles</h2>
      {user.role === 'docente' && (
        <button onClick={handleAdd} style={{ marginBottom: '1rem' }}>
          ➕ Agregar tema
        </button>
      )}
      <ul>
        {topics.map(topic => (
          <li key={topic._id} style={{ marginBottom: '1rem' }}>
            <strong>{topic.topic_name}</strong>: {topic.description}
            {user.role === 'docente' && (
              <>
                <button onClick={() => handleEdit(topic)} style={{ marginLeft: '1rem' }}>✏️ Editar</button>
                <button onClick={() => handleDelete(topic._id)} style={{ marginLeft: '0.5rem' }}>🗑️ Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

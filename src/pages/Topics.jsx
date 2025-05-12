import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import iconEdit from '../assets/icons/editar.png';
import iconDelete from '../assets/icons/eliminar.png';
import './Topics.css';

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
    if (!window.confirm('¿Eliminar este tema?')) return;
    try {
      await axios.delete(`/topics/${id}`);
      fetchTopics();
    } catch (err) {
      alert('Error al eliminar tema');
    }
  };

  const getCardClass = (index) => {
    return ['topic-yellow', 'topic-teal', 'topic-red'][index % 3];
  };

  return (
    <div className="topics-container">
      <h2>{user.role === 'docente' ? 'Temas disponibles' : 'Temas'}</h2>
      {user.role === 'docente' && (
        <button className="btn-add" onClick={handleAdd}>Tema Nuevo</button>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="nav-arrow">◀</div>
        {topics.map((topic, index) => (
          <div key={topic._id} className={`topic-card ${getCardClass(index)}`}>
            {user.role === 'docente' && (
              <>
                <img src={iconDelete} className="topic-icon delete" onClick={() => handleDelete(topic._id)} />
                <img src={iconEdit} className="topic-icon edit" onClick={() => handleEdit(topic)} />
              </>
            )}
            <div className="topic-title">{topic.topic_name}</div>
            <div>{topic.description}</div>
          </div>
        ))}
        <div className="nav-arrow">▶</div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Container, Heading, List, ListItem, Text,
  Stack, useToast, Flex
} from '@chakra-ui/react';

export default function Topics() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const toast = useToast();

  const fetchTopics = async () => {
    try {
      const res = await axios.get('/topics');
      setTopics(res.data);
    } catch (err) {
      toast({ title: 'Error', description: 'No se pudieron cargar los temas.', status: 'error' });
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = async () => {
    const topic_name = prompt('Nombre del tema:');
    if (!topic_name) return;
    const description = prompt('Descripción:');
    if (!description || description.length < 10) return toast({ title: 'Descripción demasiado corta', status: 'warning' });

    try {
      await axios.post('/topics', { topic_name, description });
      toast({ title: 'Tema agregado', status: 'success' });
      fetchTopics();
    } catch {
      toast({ title: 'Error al agregar tema', status: 'error' });
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
      toast({ title: 'Tema actualizado', status: 'success' });
      fetchTopics();
    } catch {
      toast({ title: 'Error al editar tema', status: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Estás seguro de eliminar este tema?');
    if (!confirm) return;

    try {
      await axios.delete(`/topics/${id}`);
      toast({ title: 'Tema eliminado', status: 'info' });
      fetchTopics();
    } catch {
      toast({ title: 'Error al eliminar tema', status: 'error' });
    }
  };

  return (
    <Container maxW="4xl" py={10}>
      <Heading mb={6} color="teal.600">Temas disponibles</Heading>
      {user.role === 'docente' && (
        <Button colorScheme="teal" mb={4} onClick={handleAdd}>➕ Agregar tema</Button>
      )}

      <List spacing={4}>
        {topics.map(topic => (
          <ListItem key={topic._id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold" fontSize="lg">{topic.topic_name}</Text>
                <Text color="gray.600">{topic.description}</Text>
              </Box>
              {user.role === 'docente' && (
                <Stack direction="row" spacing={2}>
                  <Button size="sm" colorScheme="yellow" onClick={() => handleEdit(topic)}>✏️ Editar</Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(topic._id)}>🗑️ Eliminar</Button>
                </Stack>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, TableContainer
} from '@chakra-ui/react';

export default function ResultTable() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`/results/user/${user._id}`).then(res => setResults(res.data));
    }
  }, [user]);

  return (
    <Box mt={10}>
      <Heading size="md" mb={4}>📚 Historial de Respuestas</Heading>
      {results.length === 0 ? (
        <Text>No has respondido ningún quiz todavía.</Text>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Pregunta</Th>
                <Th>Tu respuesta</Th>
                <Th>Resultado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map(res => (
                <Tr key={res._id}>
                  <Td>{res.quiz_id?.question || 'Pregunta eliminada'}</Td>
                  <Td>{res.selectedAnswer}</Td>
                  <Td color={res.isCorrect ? 'green.500' : 'red.500'}>
                    {res.isCorrect ? '✅ Correcto' : '❌ Incorrecto'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
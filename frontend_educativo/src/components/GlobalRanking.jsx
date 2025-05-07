import { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text
} from '@chakra-ui/react';

export default function GlobalRanking() {
  const [ranking, setRanking] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    axios.get('/results/ranking/global').then(async res => {
      const rankingData = res.data;
      setRanking(rankingData);

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
    <Box mt={10}>
      <Heading size="md" mb={4}>🏆 Ranking Global</Heading>
      {ranking.length === 0 ? (
        <Text>No hay resultados aún.</Text>
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Puesto</Th>
                <Th>Usuario</Th>
                <Th>Aciertos</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ranking.map((r, i) => (
                <Tr key={r.user_id}>
                  <Td>{i + 1}</Td>
                  <Td>{users[r.user_id] || 'Desconocido'}</Td>
                  <Td>{r.correct}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

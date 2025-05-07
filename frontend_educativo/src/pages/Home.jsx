import { Box, Button, Container, Heading, Text, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <Container maxW="3xl" centerContent py={16}>
      <Heading as="h1" size="2xl" mb={4} textAlign="center" color="teal.500">
        Bienvenido a CiberEduca
      </Heading>
      <Text fontSize="lg" mb={6} textAlign="center">
        Explora temas clave sobre ciberseguridad y pon a prueba tus conocimientos con quizzes interactivos.
      </Text>

      {!user ? (
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
          <Button as={Link} to="/login" colorScheme="teal" variant="outline">Iniciar sesión</Button>
          <Button as={Link} to="/signup" colorScheme="teal">Registrarse</Button>
        </Stack>
      ) : (
        <Text fontSize="md" mt={4} color="gray.600">
          Ya estás autenticado como <strong>{user.user_name}</strong>.
        </Text>
      )}
    </Container>
  );
}
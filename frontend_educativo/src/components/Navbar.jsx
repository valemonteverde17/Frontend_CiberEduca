import { Box, Button, Flex, Text, Spacer, Link as ChakraLink } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex as="nav" bg="teal.600" p="4" color="white" align="center">
      <Text fontWeight="bold" fontSize="xl">
        <ChakraLink as={Link} to="/">CiberEduca</ChakraLink>
      </Text>
      <Spacer />
      {user ? (
        <Flex gap="3" align="center">
          <Text fontSize="sm">Hola, {user.user_name}</Text>
          <Button size="sm" colorScheme="teal" variant="outline" onClick={() => navigate('/topics')}>Temas</Button>
          <Button size="sm" colorScheme="teal" variant="outline" onClick={() => navigate('/quizzes')}>Quizzes</Button>
          <Button size="sm" colorScheme="red" onClick={handleLogout}>Salir</Button>
        </Flex>
      ) : (
        <Flex gap="3">
          <Button size="sm" as={Link} to="/login" colorScheme="teal" variant="outline">Iniciar sesión</Button>
          <Button size="sm" as={Link} to="/signup" colorScheme="teal" variant="solid">Registrarse</Button>
        </Flex>
      )}
    </Flex>
  );
}

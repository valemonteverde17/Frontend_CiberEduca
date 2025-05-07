import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Container, FormControl, FormLabel, Input,
  Heading, VStack, useToast
} from '@chakra-ui/react';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) navigate('/topics');
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', { user_name, password });
      login(res.data);
      navigate('/topics');
    } catch (err) {
      toast({
        title: 'Error de inicio de sesión',
        description: 'Usuario o contraseña incorrectos.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Container maxW="md" mt={12}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading mb={6} textAlign="center" color="teal.600">Iniciar sesión</Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre de usuario</FormLabel>
              <Input
                placeholder="Usuario"
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full">
              Entrar
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
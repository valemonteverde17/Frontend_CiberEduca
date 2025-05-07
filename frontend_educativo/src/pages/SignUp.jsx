import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Container, FormControl, FormLabel, Input, Select,
  Heading, VStack, useToast
} from '@chakra-ui/react';

export default function SignUp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('estudiante');

  useEffect(() => {
    if (user) navigate('/topics');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', { user_name, password, role });
      toast({
        title: 'Registro exitoso',
        description: 'Ahora puedes iniciar sesión.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Error de registro',
        description: 'Revisa los datos e intenta nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Container maxW="md" mt={12}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading mb={6} textAlign="center" color="teal.600">Registrarse</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre de usuario</FormLabel>
              <Input value={user_name} onChange={e => setUserName(e.target.value)} placeholder="Usuario" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Rol</FormLabel>
              <Select value={role} onChange={e => setRole(e.target.value)}>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
              </Select>
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full">
              Crear cuenta
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
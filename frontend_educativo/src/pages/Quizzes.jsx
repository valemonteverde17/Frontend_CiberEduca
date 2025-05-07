import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Container, Heading, Select, Text, VStack,
  Radio, RadioGroup, Stack, useToast, Divider
} from '@chakra-ui/react';
import ResultTable from '../components/ResultTable';
import GlobalRanking from '../components/GlobalRanking';

export default function Quizzes() {
  const { user } = useAuth();
  const toast = useToast();

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get('/topics').then(res => setTopics(res.data));
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      axios.get(`/quizzes/topic/${selectedTopic}`).then(res => {
        setQuizzes(res.data);
        setAnswers({});
        setFeedback({});
        setScore(null);
      });
    }
  }, [selectedTopic]);

  const handleAnswer = async (quizId, selectedOption) => {
    const quiz = quizzes.find(q => q._id === quizId);
    const isCorrect = quiz.correctAnswer === selectedOption;

    setAnswers(prev => ({ ...prev, [quizId]: selectedOption }));
    setFeedback(prev => ({ ...prev, [quizId]: isCorrect }));

    try {
      await axios.post('/results', {
        user_id: user._id,
        quiz_id: quizId,
        selectedAnswer: selectedOption,
        isCorrect
      });
    } catch (err) {
      toast({ title: 'Error al guardar respuesta', status: 'error' });
    }

    const allAnswered = quizzes.every(q => answers[q._id] || q._id === quizId);
    if (allAnswered) {
      const res = await axios.get(`/results/score/${user._id}/${selectedTopic}`);
      setScore(res.data);
    }
  };

  return (
    <Container maxW="4xl" py={10}>
      <Heading mb={6} color="teal.600">Quizzes Interactivos</Heading>

      <Box mb={6}>
        <Text mb={2}>Selecciona un tema:</Text>
        <Select
          placeholder="-- Selecciona --"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          {topics.map(topic => (
            <option key={topic._id} value={topic._id}>{topic.topic_name}</option>
          ))}
        </Select>
      </Box>

      {quizzes.length === 0 && selectedTopic && <Text>No hay quizzes para este tema.</Text>}

      <VStack spacing={6} align="stretch">
        {quizzes.map(quiz => (
          <Box
            key={quiz._id}
            borderWidth={1}
            borderRadius="md"
            p={4}
            bg={feedback[quiz._id] === true
              ? 'green.50'
              : feedback[quiz._id] === false
              ? 'red.50'
              : 'white'}
          >
            <Text fontWeight="bold" mb={2}>{quiz.question}</Text>
            <RadioGroup
              onChange={(val) => handleAnswer(quiz._id, val)}
              value={answers[quiz._id] || ''}
            >
              <Stack direction="column">
                {quiz.options.map(option => (
                  <Radio key={option} value={option}>{option}</Radio>
                ))}
              </Stack>
            </RadioGroup>
            {feedback[quiz._id] !== undefined && (
              <Text mt={2} fontWeight="semibold" color={feedback[quiz._id] ? 'green.500' : 'red.500'}>
                {feedback[quiz._id] ? '✅ Correcto' : '❌ Incorrecto'}
              </Text>
            )}
          </Box>
        ))}
      </VStack>

      {score && (
        <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <Heading size="md" mb={2}>Resultado final</Heading>
          <Text>
            Has respondido <strong>{score.correct}</strong> de <strong>{score.total}</strong> preguntas correctamente.
          </Text>
        </Box>
      )}

      <Divider my={10} />

      <ResultTable />
      <GlobalRanking />
    </Container>
  );
}
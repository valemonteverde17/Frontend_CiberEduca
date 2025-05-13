import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Topics from './pages/Topics';
import Quizzes from './pages/Quizzes';
import ProtectedRoute from './components/ProtectedRoute';
import CreateQuizzes from "./pages/CreateQuizzes";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/topics" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/topics" /> : <SignUp />} />
        <Route path="/topics" element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } />
        <Route path="/quizzes" element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />
       <Route path="/crear-quiz" element={<CreateQuizzes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

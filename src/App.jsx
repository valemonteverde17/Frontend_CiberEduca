import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Quizzes from './pages/Quizzes';
import ProtectedRoute from './components/ProtectedRoute';
import CreateQuizzes from "./pages/CreateQuizzes";
import EditQuizSet from './pages/EditQuizSet';
import Games from './pages/games/Games';
import Hangman from './pages/games/Hangman';
import Memorama from './pages/games/Memorama';
import ManageHangman from './pages/games/ManageHangman';
import ManageMemorama from './pages/games/ManageMemorama';
import Profile from './pages/Profile';
import Rankings from './pages/Rankings';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManagement from './pages/admin/ContentManagement';
import Privacidad from './pages/legal/Privacidad';
import Terminos from './pages/legal/Terminos';
import Datos from './pages/legal/Datos';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/topics" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/topics" /> : <SignUp />} />
        
        {/* Rutas Legales - Públicas */}
        <Route path="/privacy" element={<Privacidad />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terms" element={<Terminos />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/cookies" element={<Datos />} />
        <Route path="/datos" element={<Datos />} />
        
        {/* Rutas Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/content" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <ContentManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/topics" element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } />
        <Route path="/topics/:id" element={
          <ProtectedRoute>
            <TopicDetail />
          </ProtectedRoute>
        } />
        <Route path="/quizzes" element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />
       <Route path="/crear-quiz" element={
         <ProtectedRoute>
           <CreateQuizzes />
         </ProtectedRoute>
       } />
       <Route path="/edit-quiz-set/:id" element={
         <ProtectedRoute>
           <EditQuizSet />
         </ProtectedRoute>
       } />
      <Route path="/games" element={
         <ProtectedRoute>
         <Games />
         </ProtectedRoute>
       } />
      <Route path="/hangman" element={
      <ProtectedRoute>
        <Hangman />
      </ProtectedRoute>
    } />
          <Route path="/memorama" element={
      <ProtectedRoute>
        <Memorama />
      </ProtectedRoute>
    } />
    <Route path="/manage-hangman" element={
      <ProtectedRoute>
        <ManageHangman />
      </ProtectedRoute>
    } />
    <Route path="/manage-memorama" element={
      <ProtectedRoute>
        <ManageMemorama />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/rankings" element={
      <ProtectedRoute>
        <Rankings />
      </ProtectedRoute>
    } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

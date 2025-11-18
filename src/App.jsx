import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import MyTopics from './pages/MyTopics';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import ReviewTopic from './pages/admin/ReviewTopic';
import UserManagement from './pages/admin/UserManagement';
import OrganizationManagement from './pages/admin/OrganizationManagement';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import RevisorDashboard from './pages/revisor/RevisorDashboard';

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
        <Route path="/topics/:id" element={
          <ProtectedRoute>
            <TopicDetail />
          </ProtectedRoute>
        } />
        <Route path="/my-topics" element={
          <ProtectedRoute allowedRoles={['docente', 'admin']}>
            <MyTopics />
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
    
    {/* Rutas de Admin */}
    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/review-topic/:id" element={
      <ProtectedRoute allowedRoles={['admin', 'revisor']}>
        <ReviewTopic />
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <UserManagement />
      </ProtectedRoute>
    } />
    <Route path="/admin/organizations" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <OrganizationManagement />
      </ProtectedRoute>
    } />

    {/* Ruta de Super Admin */}
    <Route path="/super-admin/dashboard" element={
      <ProtectedRoute allowedRoles={['admin']} requireSuper={true}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    } />

    {/* Ruta de Revisor */}
    <Route path="/revisor/dashboard" element={
      <ProtectedRoute allowedRoles={['revisor', 'admin']}>
        <RevisorDashboard />
      </ProtectedRoute>
    } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

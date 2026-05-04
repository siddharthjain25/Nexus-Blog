import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { RefreshCw } from 'lucide-react';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Posts = React.lazy(() => import('./pages/Posts'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const UserPosts = React.lazy(() => import('./pages/UserPosts'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PostEditor = React.lazy(() => import('./pages/PostEditor'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <RefreshCw className="animate-spin text-primary w-8 h-8" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/user/:username" element={<UserPosts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Admin & Author Routes */}
              <Route path="/admin" element={<ProtectedRoute authorOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/new" element={<ProtectedRoute authorOnly><PostEditor /></ProtectedRoute>} />
              <Route path="/admin/edit/:slug" element={<ProtectedRoute authorOnly><PostEditor /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

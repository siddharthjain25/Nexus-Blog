import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PostEditor = React.lazy(() => import('./pages/PostEditor'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
            <Route path="/admin/edit/:slug" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import JobDetail from './JobDetail';
import Jobs from './Jobs';  

import './index.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

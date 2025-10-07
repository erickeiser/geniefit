import React from 'react';
import { useAuth } from './contexts/AuthContext';
import App from './App';
import AuthPage from './components/AuthPage';
import Loader from './components/Loader';

const Root: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  return user ? <App /> : <AuthPage />;
};

export default Root;
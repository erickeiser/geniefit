import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from './Icons';
import Loader from './Loader';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
            <LogoIcon className="w-12 h-12 text-brand-primary" />
            <h1 className="text-3xl font-bold text-light-text mt-2">FitGenie</h1>
            <p className="text-medium-text">Your AI-Powered Fitness Coach</p>
        </div>

        <div className="bg-dark-card p-8 rounded-2xl border border-dark-border shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-light-text mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-medium-text mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-medium-text mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-dark-bg font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {loading ? <Loader size="sm" /> : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-medium-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-brand-primary hover:underline ml-1"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
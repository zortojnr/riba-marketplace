import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';

export const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <AuthForm />
    </div>
  );
};
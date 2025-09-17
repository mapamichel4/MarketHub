import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@progress/kendo-react-buttons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { LoginData, RegisterData } from '../../types/auth';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { setAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setNotification({ message: 'Login successful!', type: 'success' });
    },
    onError: () => {
      setNotification({ message: 'Login failed', type: 'error' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setNotification({ message: 'Registration successful!', type: 'success' });
    },
    onError: () => {
      setNotification({ message: 'Registration failed', type: 'error' });
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center market-theme">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl border border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>MarketHub</h1>
          <h2 className="text-xl font-semibold mt-2" style={{ color: 'var(--text-light)' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
        </div>

        {isLogin ? (
          <LoginForm 
            onSubmit={handleLogin} 
            loading={loginMutation.isPending} 
          />
        ) : (
          <RegisterForm 
            onSubmit={handleRegister} 
            loading={registerMutation.isPending} 
          />
        )}

        <div className="text-center">
          <Button
            fillMode="flat"
            themeColor="primary"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create Account' : 'Already have an account?'}
          </Button>
        </div>

        <NotificationGroup
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          {notification && (
            <Notification
              type={{
                style: notification.type === 'success' ? 'success' : 'error',
                icon: true
              }}
              closable
              onClose={() => setNotification(null)}
            >
              <span>{notification.message}</span>
            </Notification>
          )}
        </NotificationGroup>
      </div>
    </div>
  );
};
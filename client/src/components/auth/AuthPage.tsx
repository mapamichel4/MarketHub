import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@progress/kendo-react-buttons';
import { Notification } from '@progress/kendo-react-notification';
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
      setNotification({ message: 'Connexion réussie !', type: 'success' });
    },
    onError: () => {
      setNotification({ message: 'Erreur de connexion', type: 'error' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setNotification({ message: 'Inscription réussie !', type: 'success' });
    },
    onError: () => {
      setNotification({ message: 'Erreur lors de l\'inscription', type: 'error' });
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Connexion' : 'Inscription'}
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
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Créer un compte' : 'Déjà un compte ?'}
          </Button>
        </div>

        {notification && (
          <Notification
            type={notification.type}
            closable
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Notification>
        )}
      </div>
    </div>
  );
};
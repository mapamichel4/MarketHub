import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { Notification } from '@progress/kendo-react-notification';
import { loginSchema, type LoginInput } from '../../validations/auth';
import { useAuthMutations } from '../../services/authService';

const LoginForm = () => {
  const { loginMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      
      {loginMutation.isError && (
        <Notification type="error" className="mb-4">
          {loginMutation.error.message}
        </Notification>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('email')}
            type="email"
            label="Email"
            required
            className="w-full"
            valid={!errors.email}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            type="password"
            label="Mot de passe"
            required
            className="w-full"
            valid={!errors.password}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          themeColor="primary"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
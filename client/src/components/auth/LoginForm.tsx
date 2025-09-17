import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { LoginData } from '../../types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
  loading?: boolean;
}

export const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const handleSubmit = (dataItem: { [name: string]: any }) => {
    onSubmit(dataItem as LoginData);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={() => (
        <FormElement>
          <Field
            name="email"
            component={Input}
            label="Email"
            type="email"
            required
            style={{ marginBottom: '1rem' }}
          />
          <Field
            name="password"
            component={Input}
            label="Password"
            type="password"
            required
            style={{ marginBottom: '1.5rem' }}
          />
          <Button
            type="submit"
            themeColor="primary"
            size="large"
            disabled={loading}
            style={{ width: '100%', backgroundColor: 'var(--primary)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </FormElement>
      )}
    />
  );
};
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { RegisterData } from '../../types/auth';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  loading?: boolean;
}

export const RegisterForm = ({ onSubmit, loading }: RegisterFormProps) => {
  const handleSubmit = (dataItem: { [name: string]: any }) => {
    onSubmit(dataItem as RegisterData);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={() => (
        <FormElement>
          <Field
            name="name"
            component={Input}
            label="Full Name"
            required
            style={{ marginBottom: '1rem' }}
          />
          <Field
            name="email"
            component={Input}
            label="Email"
            type="email"
            required
            style={{ marginBottom: '1rem' }}
          />
          <Field
            name="location"
            component={Input}
            label="Location"
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </FormElement>
      )}
    />
  );
};
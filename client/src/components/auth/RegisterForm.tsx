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
            label="Nom complet"
            required
          />
          <Field
            name="email"
            component={Input}
            label="Email"
            type="email"
            required
          />
          <Field
            name="location"
            component={Input}
            label="Localisation"
            required
          />
          <Field
            name="password"
            component={Input}
            label="Mot de passe"
            type="password"
            required
          />
          <Button
            type="submit"
            themeColor="primary"
            disabled={loading}
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </FormElement>
      )}
    />
  );
};
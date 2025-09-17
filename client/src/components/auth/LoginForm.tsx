import { useState } from 'react';
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
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </FormElement>
      )}
    />
  );
};
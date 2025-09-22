import { Button, ButtonProps } from '@progress/kendo-react-buttons';
import { Spinner } from '@progress/kendo-react-indicators';
import React from 'react';

interface KendoButtonProps extends ButtonProps {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const KendoButton: React.FC<KendoButtonProps> = ({
  loading = false,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <Button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner
          size="small"
          className="mr-2"
          themeColor={variant === 'primary' ? 'primary' : 'secondary'}
        />
      )}
      {children}
    </Button>
  );
};
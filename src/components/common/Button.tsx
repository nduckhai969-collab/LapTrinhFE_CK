import type { ReactNode } from 'react';

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary';
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

const Button = (_props: ButtonProps) => {
  return null;
};

export default Button;

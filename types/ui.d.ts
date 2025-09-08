// UI Component Type Declarations

import { ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

export interface CardProps {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export interface CardHeaderProps {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export interface CardTitleProps {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export interface CardContentProps {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export interface BadgeProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  [key: string]: any;
}

export interface ProgressProps {
  value?: number;
  className?: string;
  [key: string]: any;
}






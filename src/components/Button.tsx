// src/components/Button.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'alt';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const Component = styled('button')`
    display: inline-block;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: 4px;
    border: ${variant === 'alt' ? `1px solid ${theme.colors.primary}` : 'none'};
    background: ${
      variant === 'main' ? theme.colors.primary : 'transparent'
    };
    color: ${
      variant === 'main' ? theme.colors.background : theme.colors.primary
    };
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return (
    <Component type="button" {...props}>
      {children}
    </Component>
  );
};
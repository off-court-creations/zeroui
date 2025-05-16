// src/components/Stack.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme, Theme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Presettable {
  direction?: 'row' | 'column';
  spacing?: keyof Theme['spacing'] | string;
}

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = '0',
  preset: p,
  className,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const gap =
    typeof spacing === 'string' && spacing in theme.spacing
      ? theme.spacing[spacing as keyof Theme['spacing']]
      : spacing;

  const Base = styled('div')`
    display: flex;
    flex-direction: ${direction};
    gap: ${gap};
  `;

  const presetClasses = p ? preset(p) : '';

  return (
    <Base
      {...rest}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Base>
  );
};

export default Stack;

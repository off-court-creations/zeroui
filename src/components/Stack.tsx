// src/components/Stack.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme, Theme } from '../system/themeStore';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row (horizontal) or column (vertical) layout */
  direction?: 'row' | 'column';
  /** Spacing between children: theme key (e.g. 'sm','md','lg') or any CSS size ('8px','1rem') */
  spacing?: keyof Theme['spacing'] | string;
}

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = '0',
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Resolve gap value: theme key or raw CSS size
  const gapValue =
    typeof spacing === 'string' && spacing in theme.spacing
      ? theme.spacing[spacing as keyof Theme['spacing']]
      : (spacing as string);

  const Component = styled('div')`
    display: flex;
    flex-direction: ${direction};
    gap: ${gapValue};
  `;

  return <Component {...props}>{children}</Component>;
};

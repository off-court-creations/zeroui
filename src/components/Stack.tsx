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
  /** If `true`, children wrap onto new lines/columns when they run out of space.
   *  Defaults to `true` for `row`, `false` for `column`. */
  wrap?: boolean;
}

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = '0',
  wrap,
  preset: p,
  className,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  // Resolve theme spacing token → actual CSS length
  const gap =
    typeof spacing === 'string' && spacing in theme.spacing
      ? theme.spacing[spacing as keyof Theme['spacing']]
      : spacing;

  // Enable wrapping by default when laying out in a row
  const shouldWrap =
    typeof wrap === 'boolean' ? wrap : direction === 'row';

  const Base = styled('div')`
    display: flex;
    flex-direction: ${direction};
    gap: ${gap};
    ${shouldWrap ? 'flex-wrap: wrap;' : ''}
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

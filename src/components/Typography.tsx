// src/components/Typography.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';

export type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'subbody';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  bold?: boolean;
  italic?: boolean;
}

const variantMapping: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  subbody: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  bold = false,
  italic = false,
  children,
  ...props
}) => {
  const Tag = variantMapping[variant];
  const { theme } = useTheme();

  const sizes: Record<Variant, string> = {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem',
    body: '1rem',
    subbody: '0.875rem',
  };

  const Component = styled(Tag)`
    margin: 0;
    color: ${theme.colors.primary};
    font-size: ${sizes[variant]};
    font-weight: ${bold ? '700' : '400'};
    font-style: ${italic ? 'italic' : 'normal'};
    line-height: 1.4;
  `;

  return (
    <Component {...props}>
      {children}
    </Component>
  );
};
// src/components/Typography.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { useSurface } from './Surface';

export type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'subtitle';
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> { variant?: Variant; bold?: boolean; italic?: boolean; fontSize?: string; scale?: number; autoSize?: boolean; }
const mapping: Record<Variant, keyof JSX.IntrinsicElements> = { h1:'h1', h2:'h2', h3:'h3', h4:'h4', h5:'h5', h6:'h6', body:'p', subtitle:'span' };

export const Typography: React.FC<TypographyProps> = ({
  variant='body', bold=false, italic=false, fontSize, scale, autoSize=false, children, ...props
}) => {
  const Tag = mapping[variant];
  const { theme } = useTheme();
  const { breakpoint } = useSurface();

  const defaultSize = theme.typography[variant].md;
  let size = autoSize ? theme.typography[variant][breakpoint] : defaultSize;

  if (scale != null) size = `calc(${defaultSize} * ${scale})`;
  if (fontSize) size = fontSize;

  const Component = styled(Tag)`
    margin: 0;
    color: ${theme.colors.primary};
    font-size: ${size};
    font-weight: ${bold ? '700' : '400'};
    font-style: ${italic ? 'italic' : 'normal'};
    line-height: 1.4;
  `;

  return <Component {...props}>{children}</Component>;
};
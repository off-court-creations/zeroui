// ─────────────────────────────────────────────────────────────
// src/components/Typography.tsx
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { useSurface } from './Surface';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export type Variant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body' | 'subtitle';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    Presettable {
  variant?: Variant;
  bold?: boolean;
  italic?: boolean;
  fontSize?: string;
  scale?: number;
  autoSize?: boolean;
  /** Explicit colour override */
  color?: string;
}

const mapping: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1:'h1', h2:'h2', h3:'h3', h4:'h4', h5:'h5', h6:'h6',
  body:'p', subtitle:'span',
};

/*───────────────────────────────────────────────────────────*/
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  bold = false,
  italic = false,
  fontSize,
  scale,
  autoSize = false,
  color,                 // ← explicit override
  preset: p,
  className,
  children,
  ...props
}) => {
  const Tag = mapping[variant];
  const { theme } = useTheme();
  const { breakpoint } = useSurface();

  /* ----- size ----------------------------------------------------------- */
  const defaultSize = theme.typography[variant].md;
  let size = autoSize ? theme.typography[variant][breakpoint] : defaultSize;
  if (scale != null) size = `calc(${defaultSize} * ${scale})`;
  if (fontSize) size = fontSize;

  /* ----- colour rule (conditional) ------------------------------------- */
  // 1. explicit colour prop → always emit
  // 2. rely on CSS variable if present
  // 3. otherwise emit *nothing* so the preset / parent colour wins
  const needsRule = color != null;
  const colourCSS = needsRule
    ? color
    : 'var(--zero-text-color)';   // will be ignored if the var is unset

  const Component = styled(Tag as any)<{ $needs?: boolean }>`
    margin: 0;
    ${props => props.$needs && `color: ${colourCSS};`}
    font-size: ${size};
    font-weight: ${bold ? 700 : 400};
    font-style: ${italic ? 'italic' : 'normal'};
    line-height: 1.4;
  `;

  const presetClasses = p ? preset(p) : '';

  return (
    <Component
      {...props}
      $needs={needsRule}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Component>
  );
};

export default Typography;

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
  /** Explicit text color; overrides inheritance */
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
  color,
  preset: p,
  className,
  children,
  ...props
}) => {
  const Tag = mapping[variant];
  const { theme } = useTheme();
  const { breakpoint } = useSurface();

  /* -------- size logic -------- */
  const defaultSize = theme.typography[variant].md;
  let size = autoSize ? theme.typography[variant][breakpoint] : defaultSize;
  if (scale != null) size = `calc(${defaultSize} * ${scale})`;
  if (fontSize) size = fontSize;

  /* -------- color logic --------
     - Explicit `color` prop wins
     - Otherwise inherit (`currentColor`) which responds to Button hover etc.
     - Panels/Surfaces now set their own `color`, so inheritance gives proper contrast. */
  const resolvedColor = color ?? 'currentColor';

  const Component = styled(Tag)`
    margin: 0;
    color: ${resolvedColor};
    font-size: ${size};
    font-weight: ${bold ? '700' : '400'};
    font-style: ${italic ? 'italic' : 'normal'};
    line-height: 1.4;
  `;

  const presetClasses = p ? preset(p) : '';

  return (
    <Component
      {...props}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Component>
  );
};

export default Typography;

// src/components/Typography.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { useSurface } from './Surface';

/** Available text variants (mapped to semantic HTML tags) */
export type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'subtitle';

/** Public prop type for Typography */
export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Text style preset. */
  variant?: Variant;
  /** Force bold weight (`font-weight: 700`). */
  bold?: boolean;
  /** Force italic style (`font-style: italic`). */
  italic?: boolean;
  /** Absolute override (e.g. `"20px"` or `"1.25rem"`). */
  fontSize?: string;
  /** Multiplier applied to the default `md` size (`scale={1.2}` → 20% bigger). */
  scale?: number;
  /** When `true`, size responds to current Surface breakpoint. */
  autoSize?: boolean;
}

const mapping: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  subtitle: 'span',
};

/**
 * **Typography** – ZeroUI’s text primitive.
 *
 * It exposes design-system variants (h1-h6, body, subtitle) and
 * advanced sizing options:
 *
 * 1. **Default** – uses the `md` breakpoint size from theme.
 * 2. `autoSize` – picks size dynamically from Surface breakpoint.
 * 3. `scale` – multiplies the default (`md`) size.
 * 4. `fontSize` – absolute override.
 *
 * ### Examples
 *
 * ```tsx
 * <Typography variant="h2">Heading</Typography>
 * <Typography variant="body" italic>
 *   Descriptive copy…
 * </Typography>
 * <Typography variant="body" autoSize>
 *   Responsive body text
 * </Typography>
 * <Typography variant="subtitle" bold scale={1.1}>
 *   Prominent subtitle
 * </Typography>
 * ```
 *
 * @component
 *
 * @param {TypographyProps & React.HTMLAttributes<HTMLElement>} props Component props.
 * @returns {JSX.Element} Styled text element.
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  bold = false,
  italic = false,
  fontSize,
  scale,
  autoSize = false,
  children,
  ...props
}) => {
  const Tag = mapping[variant];
  const { theme } = useTheme();
  const { breakpoint } = useSurface();

  // 1. base size from md breakpoint
  const defaultSize = theme.typography[variant].md;

  // 2. auto responsive size if enabled
  let size = autoSize
    ? theme.typography[variant][breakpoint]
    : defaultSize;

  // 3. scale multiplier
  if (scale != null) size = `calc(${defaultSize} * ${scale})`;

  // 4. absolute override
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

export default Typography;

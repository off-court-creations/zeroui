// src/components/Button.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import type { Theme } from '../system/themeStore'; 

/**
 * Visual theme variants a Button can render.
 * - **`main`** – Solid background, primary call-to-action.
 * - **`alt`**  – Transparent background, 1 px outline, secondary action.
 */
export type ButtonVariant = 'main' | 'alt';

/**
 * Pre-defined sizing presets for the Button.
 * - **`sm`** – 32 px tall, 0.75 rem font.
 * - **`md`** – 40 px tall, 0.875 rem font (default).
 * - **`lg`** – 48 px tall, 1 rem font.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * **ButtonProps**
 *
 * Extends every intrinsic `<button>` prop and adds ZeroUI-specific controls.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style: `"main"` (solid) or `"alt"` (outlined). */
  variant?: ButtonVariant;
  /** Overall control size: `"sm" | "md" | "lg"`. */
  size?: ButtonSize;
}

/**
 * Internal mapping of `size` → padding, font-size, and exterior height.
 * @param theme The current design-system theme object.
 */
const createSizeMap = (theme: Theme) => ({
  sm: {
    padV: theme.spacing.sm,  // 4 px
    padH: theme.spacing.md,  // 8 px
    font: '0.75rem',
    height: '32px',
  },
  md: {
    padV: theme.spacing.sm,  // 4 px
    padH: theme.spacing.lg,  // 16 px
    font: '0.875rem',
    height: '40px',
  },
  lg: {
    padV: theme.spacing.md,  // 8 px
    padH: theme.spacing.lg,  // 16 px
    font: '1rem',
    height: '48px',
  },
} as const);

/**
 * **Button** – ZeroUI’s primary actionable element.
 *
 * ```tsx
 * <Button size="sm">Save</Button>
 * <Button variant="alt" size="md">Cancel</Button>
 * <Button size="lg" disabled>Processing…</Button>
 * ```
 *
 * @component
 * @param {ButtonProps}   props           Component props.
 * @param {'main'|'alt'} [props.variant]  Visual style (default `"main"`).
 * @param {'sm'|'md'|'lg'} [props.size]   Size preset (default `"md"`).
 * @returns {JSX.Element} Rendered button element.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  size = 'md',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const sizeMap = createSizeMap(theme);

  const { padV, padH, font, height } = sizeMap[size];

  /* Alt’s padding is reduced 1 px per side to offset its 1 px border. */
  const padRule =
    variant === 'alt'
      ? `calc(${padV} - 1px) calc(${padH} - 1px)`
      : `${padV} ${padH}`;

  const Component = styled('button')`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: ${height};        /* Exterior dimension token */
    min-width: ${height};     /* Ensures square feel on minimal labels */

    padding: ${padRule};
    box-sizing: border-box;

    border-radius: 4px;
    border: ${variant === 'alt'
      ? `1px solid ${theme.colors.text}`
      : 'none'};
    background: ${variant === 'main'
      ? theme.colors.primary
      : 'transparent'};
    color: ${theme.colors.text};

    font-size: ${font};
    font-weight: 600;
    cursor: pointer;

    transition: background 0.2s ease, color 0.2s ease, filter 0.2s ease;

    /* Hover (enabled only) */
    &:hover:not(:disabled) {
      ${variant === 'main'
        ? 'filter: brightness(1.25);'
        : `
          background: ${theme.colors.text};
          color: ${theme.colors.background};
        `}
    }

    /* Disabled state */
    &:disabled {
      opacity: 0.5;
      cursor: default;  /* Pointer doesn’t change on hover */
    }
  `;

  return (
    <Component type="button" {...props}>
      {children}
    </Component>
  );
};

export default Button;

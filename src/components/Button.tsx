// src/components/Button.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import type { Theme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

/*───────────────────────────────────────────────────────────────────────────*/
/* Public types                                                              */

export type ButtonVariant = 'main' | 'alt';   // Solid vs. outlined
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Presettable {
  /** Visual style: `"main"` (solid) or `"alt"` (outlined). */
  variant?: ButtonVariant;
  /** Overall control size: `"sm" | "md" | "lg"`. */
  size?: ButtonSize;
}

/*───────────────────────────────────────────────────────────────────────────*/
/* Implementation helpers                                                   */

const createSizeMap = (theme: Theme) => ({
  sm: {
    padV: theme.spacing.sm,
    padH: theme.spacing.md,
    font: '0.75rem',
    height: '32px',
  },
  md: {
    padV: theme.spacing.sm,
    padH: theme.spacing.lg,
    font: '0.875rem',
    height: '40px',
  },
  lg: {
    padV: theme.spacing.md,
    padH: theme.spacing.lg,
    font: '1rem',
    height: '48px',
  },
} as const);

/*───────────────────────────────────────────────────────────────────────────*/
/* Component                                                                 */

export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  size = 'md',
  preset: p,
  className,
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

  const rippleColor =
    variant === 'main' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';

  const Component = styled('button')`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: hidden;

    height: ${height};
    min-width: ${height};
    padding: ${padRule};
    box-sizing: border-box;

    border-radius: 4px;
    border: ${variant === 'alt' ? `1px solid ${theme.colors.text}` : 'none'};
    background: ${variant === 'main' ? theme.colors.primary : 'transparent'};
    color: ${theme.colors.text};

    font-size: ${font};
    font-weight: 600;
    cursor: pointer;

    transition: background 0.2s ease, color 0.2s ease, filter 0.2s ease, transform 0.1s ease;

    /*──────────────────────────────────────*/
    /* Disable iOS text selection / tap-hold*/
    user-select: none;            /* Standard */
    -webkit-user-select: none;    /* Safari / iOS */
    -ms-user-select: none;        /* IE / Edge */
    -webkit-touch-callout: none;  /* iOS long-press menu */
    -webkit-tap-highlight-color: transparent;

    /* Ensure nested elements are also non-selectable */
    & * {
      user-select: none;
      -webkit-user-select: none;
    }
    /*──────────────────────────────────────*/

    &:hover:not(:disabled) {
      ${variant === 'main'
        ? 'filter: brightness(1.25);'
        : `
          background: ${theme.colors.text};
          color: ${theme.colors.background};
        `}
    }

    &:active:not(:disabled) {
      transform: scale(0.96);
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: ${rippleColor};
      border-radius: inherit;
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    &:active::after {
      opacity: 1;
      transform: scale(1);
    }
  `;

  const presetClasses = p ? preset(p) : '';

  return (
    <Component
      type="button"
      {...props}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Component>
  );
};

export default Button;

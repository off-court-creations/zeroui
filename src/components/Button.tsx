import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import type { Theme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

/*───────────────────────────────────────────────────────────*/
/* Types */

export type ButtonVariant = 'main' | 'alt';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Presettable {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/*───────────────────────────────────────────────────────────*/
/* Size map (REM based) */

const createSizeMap = (theme: Theme) => ({
  sm: { padV: theme.spacing.sm, padH: theme.spacing.md, font: '0.75rem',  height: '2rem'  },
  md: { padV: theme.spacing.sm, padH: theme.spacing.lg, font: '0.875rem', height: '2.5rem'},
  lg: { padV: theme.spacing.md, padH: theme.spacing.lg, font: '1rem',     height: '3rem'  },
} as const);

/*───────────────────────────────────────────────────────────*/
/* Styled base */

const BaseBtn = styled('button')<{
  $variant: ButtonVariant;
  $height: string;         // ← string now
  $padRule: string;
  $font: string;
  $minW: string;
  $primary: string;
  $text: string;
  $ripple: string;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  height: ${({ $height }) => $height};
  min-width: ${({ $minW }) => $minW};
  padding: ${({ $padRule }) => $padRule};
  box-sizing: border-box;

  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};

  border-radius: 4px;
  border: ${({ $variant, $text }) => ($variant === 'alt' ? `1px solid ${$text}` : 'none')};
  background: ${({ $variant, $primary }) => ($variant === 'main' ? $primary : 'transparent')};
  color: ${({ $text }) => $text};

  font-size: ${({ $font }) => $font};
  font-weight: 600;
  cursor: pointer;

  transition: background 0.2s ease, color 0.2s ease, filter 0.2s ease, transform 0.1s ease;

  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;

  & * {
    user-select: none;
    -webkit-user-select: none;
  }

  &:hover:not(:disabled) {
    ${({ $variant, $text, $primary }) =>
      $variant === 'main'
        ? 'filter: brightness(1.25);'
        : `background: ${$text}; color: ${$primary};`}
  }

  &:active:not(:disabled) { transform: scale(0.96); }

  &:disabled { opacity: 0.5; cursor: default; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $ripple }) => $ripple};
    border-radius: inherit;
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  &:active::after { opacity: 1; transform: scale(1); }
`;

/*───────────────────────────────────────────────────────────*/
/* Component */

export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  size = 'md',
  fullWidth = false,
  preset: p,
  className,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const { padV, padH, font, height } = createSizeMap(theme)[size];

  const padRule =
    variant === 'alt'
      ? `calc(${padV} - 1px) calc(${padH} - 1px)`
      : `${padV} ${padH}`;

  const minW = `calc(${height} * 2)`;           // keep classic rectangle
  const rippleColor = variant === 'main'
    ? 'rgba(255,255,255,0.3)'
    : 'rgba(0,0,0,0.1)';

  const presetClasses = p ? preset(p) : '';

  return (
    <BaseBtn
      type="button"
      {...props}
      $variant={variant}
      $height={height}
      $padRule={padRule}
      $font={font}
      $minW={minW}
      $primary={theme.colors.primary}
      $text={theme.colors.text}
      $ripple={rippleColor}
      $fullWidth={fullWidth}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </BaseBtn>
  );
};

export default Button;

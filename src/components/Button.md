import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import type { Theme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export type ButtonVariant = 'main' | 'alt';
export type ButtonSize    = 'sm'   | 'md'  | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Presettable {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/* size map -------------------------------------------------------------- */
const sizeMap = (t: Theme) => ({
  sm: { padV: t.spacing.sm, padH: t.spacing.md, font: '0.75rem',  height: '2rem'  },
  md: { padV: t.spacing.sm, padH: t.spacing.lg, font: '0.875rem', height: '2.5rem'},
  lg: { padV: t.spacing.md, padH: t.spacing.lg, font: '1rem',     height: '3rem'  },
} as const);

/* styled base ----------------------------------------------------------- */
const Base = styled('button')<{
  $variant: ButtonVariant;
  $height: string;
  $pad   : string;
  $font  : string;
  $minW  : string;
  $primary: string;
  $primaryText: string;
  $text  : string;
  $ripple: string;
  $full? : boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  height    : ${({ $height }) => $height};
  min-width : ${({ $minW  }) => $minW };
  padding   : ${({ $pad   }) => $pad };
  box-sizing: border-box;

  align-self: ${({ $full }) => ($full ? 'stretch' : 'flex-start')};
  width     : ${({ $full }) => ($full ? '100%'   : 'auto')};

  border-radius: 4px;
  border: ${({ $variant }) =>
    $variant === 'alt'
      ? '1px solid var(--zero-text-color, currentColor)'
      : 'none'};

  background: ${({ $variant, $primary }) =>
    $variant === 'main' ? $primary : 'transparent'};

  color: ${({ $text }) => $text};
  --zero-text-color: ${({ $text }) => $text};

  font-size: ${({ $font }) => $font};
  font-weight: 600;
  cursor: pointer;

  transition:
    background 0.2s ease,
    color      0.2s ease,
    filter     0.2s ease,
    transform  0.1s ease;

  user-select: none;

  &:hover:not(:disabled) {
    ${({ $variant, $primary, $primaryText }) =>
      $variant === 'main'
        ? 'filter: brightness(1.25);'
        : `
          background: var(--zero-text-color, ${$primary});
          color: ${$primaryText};
        `}
  }

  &:active:not(:disabled) { transform: scale(0.96); }
  &:disabled             { opacity: 0.5; cursor: default; }

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

/* component ------------------------------------------------------------- */
export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  size    = 'md',
  fullWidth = false,
  preset: p,
  className,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const { padV, padH, font, height } = sizeMap(theme)[size];

  const pad   = variant === 'alt'
    ? `calc(${padV} - 1px) calc(${padH} - 1px)`
    : `${padV} ${padH}`;

  const minW  = `calc(${height} * 2)`;
  const ripple =
    variant === 'main'
      ? 'rgba(255,255,255,0.25)'
      : 'rgba(0,0,0,0.1)';

  const textColour =
    variant === 'main'
      ? theme.colors.primaryText
      : `var(--zero-text-color, ${theme.colors.text})`;

  const presetClasses = p ? preset(p) : '';

  return (
    <Base
      type="button"
      {...rest}
      $variant={variant}
      $height={height}
      $pad={pad}
      $font={font}
      $minW={minW}
      $primary={theme.colors.primary}
      $primaryText={theme.colors.primaryText}
      $text={textColour}
      $ripple={ripple}
      $full={fullWidth}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Base>
  );
};

export default Button;

// src/components/Button.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'alt';
}

/**
 * **Button** – ZeroUI’s primary actionable element.
 *
 * A semantic `<button>` wrapper that supports two visual
 * variants (“main” & “alt”) and inherits every native
 * `HTMLButtonElement` prop.
 *
 * ### Variants
 * | Variant | Description                                |
 * |---------|--------------------------------------------|
 * | `main`  | Solid, filled background — used for primary actions. |
 * | `alt`   | Transparent with 1 px outline — used for secondary actions. |
 *
 * ### States
 * The component automatically styles:
 * - `:hover`
 * - `:disabled`
 *
 * ### Theme hooks
 * - Uses `theme.colors.primary` for the main variant background.
 * - Uses `theme.colors.background` for the main variant text color.
 * - Uses `theme.spacing.sm` / `theme.spacing.md` for padding.
 *
 * @component
 * @example <caption>Main (primary) button</caption>
 * ```tsx
 * <Button variant="main">Save</Button>
 * ```
 *
 * @example <caption>Alt (secondary) button</caption>
 * ```tsx
 * <Button variant="alt">Cancel</Button>
 * ```
 *
 * @example <caption>Disabled state</caption>
 * ```tsx
 * <Button variant="main" disabled>Processing…</Button>
 * ```
 *
 * @typedef {object} ButtonProps
 * @property {'main' | 'alt'} [variant='main'] Visual style of the button.
 * @property {React.ReactNode} children Button label / contents.
 *
 * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props Component props.
 * @returns {JSX.Element} Rendered button element.
 */

export const Button: React.FC<ButtonProps> = ({
  variant = 'main',
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const Component = styled('button')`
    display: inline-block;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: 4px;
    border: ${variant === 'alt'
      ? `1px solid ${theme.colors.primary}`
      : 'none'};
    background: ${variant === 'main'
      ? theme.colors.primary
      : 'transparent'};
    color: ${variant === 'main'
      ? theme.colors.background
      : theme.colors.primary};
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return (
    <Component type="button" {...props}>
      {children}
    </Component>
  );
};

export default Button;        // <— having a default export also helps

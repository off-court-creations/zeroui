import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export type PanelVariant = 'main' | 'alt';

export interface PanelProps
  extends React.ComponentProps<'div'>,
    Presettable {
  variant?: PanelVariant;
  fullWidth?: boolean;
  /** Background override */
  background?: string;
}

/*───────────────────────────────────────────────────────────*/
const Base = styled('div')<{
  $variant: PanelVariant;
  $fullWidth?: boolean;
  $outline: string;
  $bg: string;
  $textColor: string;
}>`
  box-sizing: border-box;
  vertical-align: top;

  display: ${({ $fullWidth }) => ($fullWidth ? 'block' : 'inline-block')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  align-self: ${({ $fullWidth }) => ($fullWidth ? 'stretch' : 'flex-start')};

  background: ${({ $variant, $bg }) => ($variant === 'main' ? $bg : 'transparent')};
  border: ${({ $variant, $outline }) => ($variant === 'alt' ? `1px solid ${$outline}` : 'none')};

  /* Provide contrast color to children */
  color: ${({ $textColor }) => $textColor};
  --zero-text-color: ${({ $textColor }) => $textColor};
`;

/*───────────────────────────────────────────────────────────*/
export const Panel: React.FC<PanelProps> = ({
  variant = 'main',
  fullWidth = false,
  preset: p,
  className,
  style,
  background,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const presetClasses = p ? preset(p) : '';

  const bg = background ??
    (variant === 'main' ? theme.colors.backgroundAlt : 'transparent');

  /* Map background to matching text token */
  const textColor =
    bg === theme.colors.primary   ? theme.colors.primaryText   :
    bg === theme.colors.secondary ? theme.colors.secondaryText :
    bg === theme.colors.tertiary  ? theme.colors.tertiaryText  :
    theme.colors.text;

  return (
    <Base
      {...rest}
      $variant={variant}
      $fullWidth={fullWidth}
      $outline={theme.colors.backgroundAlt}
      $bg={bg}
      $textColor={textColor}
      style={{ ...style }}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Base>
  );
};

export default Panel;

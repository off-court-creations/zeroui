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
  background?: string;
}

/*───────────────────────────────────────────────────────────*/
const Base = styled('div')<{
  $variant: PanelVariant;
  $full?: boolean;
  $outline: string;
  $bg: string;
  $text?: string;
}>`
  box-sizing: border-box;
  vertical-align: top;

  display: ${({ $full }) => ($full ? 'block' : 'inline-block')};
  width  : ${({ $full }) => ($full ? '100%' : 'auto')};
  align-self: ${({ $full }) => ($full ? 'stretch' : 'flex-start')};

  background: ${({ $variant, $bg }) =>
    $variant === 'main' ? $bg : 'transparent'};
  border: ${({ $variant, $outline }) =>
    $variant === 'alt' ? `1px solid ${$outline}` : 'none'};

  ${({ $text }) => $text ? `
    color: ${$text};
    --zero-text-color: ${$text};
  ` : ''}

  --zero-bg: ${({ $bg }) => $bg};
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

  const bg =
    background ??
    (variant === 'main' ? theme.colors.backgroundAlt : 'transparent');

  /* Don’t stomp on a parent’s colour when transparent ------------------- */
  let textColour: string | undefined;
  if (bg !== 'transparent') {
    textColour =
      bg === theme.colors.primary   ? theme.colors.primaryText   :
      bg === theme.colors.secondary ? theme.colors.secondaryText :
      bg === theme.colors.tertiary  ? theme.colors.tertiaryText  :
      theme.colors.text;
  }

  return (
    <Base
      {...rest}
      $variant={variant}
      $full={fullWidth}
      $outline={theme.colors.backgroundAlt}
      $bg={bg}
      $text={textColour}
      style={style}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </Base>
  );
};

export default Panel;

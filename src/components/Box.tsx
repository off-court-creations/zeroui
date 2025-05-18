import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export interface BoxProps
  extends React.ComponentProps<'div'>,
    Presettable {
  background?: string;
  textColor?: string;
}

/*───────────────────────────────────────────────────────────*/
const Base = styled('div')<{
  $bg: string | undefined;
  $text: string;
}>`
  box-sizing: border-box;
  display: block;

  background: ${({ $bg }) => $bg ?? 'transparent'};
  color: ${({ $text }) => $text};

  --zero-text-color: ${({ $text }) => $text};
  --zero-bg: ${({ $bg }) => $bg ?? 'transparent'};
`;

/*───────────────────────────────────────────────────────────*/
export const Box: React.FC<BoxProps> = ({
  preset: p,
  className,
  background,
  textColor,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const presetClasses = p ? preset(p) : '';

  let resolvedText = textColor ?? theme.colors.text;

  if (!textColor && background) {
    resolvedText =
      background === theme.colors.primary   ? theme.colors.primaryText   :
      background === theme.colors.secondary ? theme.colors.secondaryText :
      background === theme.colors.tertiary  ? theme.colors.tertiaryText  :
      theme.colors.text;
  }

  return (
    <Base
      {...rest}
      $bg={background}
      $text={resolvedText}
      style={style}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    />
  );
};

export default Box;

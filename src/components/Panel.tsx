// src/components/Panel.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { preset } from '../css/stylePresets';
import { useTheme } from '../system/themeStore';
import type { Presettable } from '../types';

export interface PanelProps extends React.ComponentProps<'div'>, Presettable {
  /** Set false to remove default background. */
  backgroundAlt?: boolean;
}

/**
 * Panel — Content-wrapping, visually separated container.
 * By default, gets theme.colors.backgroundAlt as background.
 * You can override the background with style/preset/class as needed.
 */
const Base = styled('div')`
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  /* Background is handled inline for dynamic theme access */
`;

export const Panel: React.FC<PanelProps> = ({
  preset: p,
  className,
  style,
  backgroundAlt = true,
  ...rest
}) => {
  const { theme } = useTheme();
  const presetClasses = p ? preset(p) : '';

  // If background is not already overridden, apply default from theme
  const bg =
    backgroundAlt &&
    (!style?.background && !style?.backgroundColor)
      ? { background: theme.colors.backgroundAlt }
      : undefined;

  return (
    <Base
      {...rest}
      style={{ ...bg, ...style }}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    />
  );
};

export default Panel;

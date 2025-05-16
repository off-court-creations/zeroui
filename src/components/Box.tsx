// src/components/Box.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

/**
 * **Box** – the most basic layout primitive in ZeroUI.
 *
 * A thin wrapper around a `<div>` that:
 * - Resets `box-sizing` to `border-box`
 * - Provides a consistent hook for additional layout or spacing props
 * - Accepts **all** native `HTMLDivElement` attributes
 * - Supports **style presets** via the `preset` prop
 *
 * Use it as a building-block container when you need a neutral,
 * style-free wrapper before reaching for more opinionated components
 * (e.g. `Stack`, `Surface`, etc.).
 *
 * @component
 *
 * @example <caption>Simple wrapper</caption>
 * ```tsx
 * <Box preset="card">
 *   <Typography variant="body">Hello from inside Box</Typography>
 * </Box>
 * ```
 *
 * @example <caption>Combining with inline styles</caption>
 * ```tsx
 * <Box style={{ background: '#efefef', borderRadius: 8 }}>
 *   Content with a gray background
 * </Box>
 * ```
 *
 * @typedef {object} BoxProps
 * @property {React.ReactNode} children Contents of the box.
 * @property {React.CSSProperties} [style] Inline style overrides.
 * @property {string|string[]} [preset] One or many style-preset names
 *                                      registered via `definePreset()`.
 *
 * @param {BoxProps & React.ComponentProps<'div'>} props Component props.
 * @returns {JSX.Element} Neutral div wrapper.
 */
export interface BoxProps
  extends React.ComponentProps<'div'>,
  Presettable { }

export const Box: React.FC<BoxProps> = ({
  preset: p,
  className,
  ...props
}) => {
  const presetClasses = p ? preset(p) : '';
  return (
    <BoxBase
      {...props}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    />
  );
};

export default Box;

/* -------------------------------------------------------------------- */

const BoxBase = styled('div')`
  box-sizing: border-box;
  display: block;
`;

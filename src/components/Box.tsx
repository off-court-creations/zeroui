// src/components/Box.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

export interface BoxProps extends React.ComponentProps<'div'>, Presettable {}

const Base = styled('div')`
  box-sizing: border-box;
  display: block;
`;

export const Box: React.FC<BoxProps> = ({ preset: p, className, ...rest }) => {
  const presetClasses = p ? preset(p) : '';
  return (
    <Base
      {...rest}
      className={[presetClasses, className].filter(Boolean).join(' ')}
    />
  );
};

export default Box;

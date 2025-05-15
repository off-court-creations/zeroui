import React from 'react';
import { styled } from '../css/createStyled';

const BoxBase = styled('div')`
  box-sizing: border-box;
  display: block;
`;

export const Box = (props: React.ComponentProps<'div'>) => {
  return <BoxBase {...props} />;
};

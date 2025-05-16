// src/components/Stack.tsx
import React from 'react';
import { styled } from '../css/createStyled';
import { useTheme, Theme } from '../system/themeStore';

/** Public prop type for Stack (must be exported) */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row (horizontal) or column (vertical) layout */
  direction?: 'row' | 'column';
  /** Gap between children – theme spacing key (`'sm' | 'md' | 'lg'`) or any CSS size (`'8px'`, `'1rem'`, etc.) */
  spacing?: keyof Theme['spacing'] | string;
}

/**
 * **Stack** – a lightweight flexbox utility for simple one-dimensional layouts.
 *
 * It arranges direct children in a row or column and applies a `gap`
 * so you don’t need to sprinkle individual margins.
 *
 * ### Props
 * | Prop       | Type                                    | Default   | Description                                   |
 * |------------|-----------------------------------------|-----------|-----------------------------------------------|
 * | `direction`| `'row' \\| 'column'`                    | `'column'`| Layout axis.                                  |
 * | `spacing`  | `keyof Theme['spacing'] \\| string`     | `'0'`     | Gap between items – design token or CSS size. |
 *
 * @component
 *
 * @example <caption>Vertical stack (default)</caption>
 * ```tsx
 * <Stack spacing="md">
 *   <Typography variant="body">Item 1</Typography>
 *   <Typography variant="body">Item 2</Typography>
 * </Stack>
 * ```
 *
 * @example <caption>Horizontal stack with custom gap</caption>
 * ```tsx
 * <Stack direction="row" spacing="24px">
 *   <Button variant="main">Accept</Button>
 *   <Button variant="alt">Decline</Button>
 * </Stack>
 * ```
 *
 * @param {StackProps & React.HTMLAttributes<HTMLDivElement>} props Component props.
 * @returns {JSX.Element} Flex container with consistent gap.
 */
export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  spacing = '0',
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Resolve gap value: theme token OR raw CSS size
  const gapValue =
    typeof spacing === 'string' && spacing in theme.spacing
      ? theme.spacing[spacing as keyof Theme['spacing']]
      : (spacing as string);

  const Component = styled('div')`
    display: flex;
    flex-direction: ${direction};
    gap: ${gapValue};
  `;

  return <Component {...props}>{children}</Component>;
};

export default Stack;

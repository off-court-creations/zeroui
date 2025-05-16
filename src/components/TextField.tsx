// src/components/TextField.tsx
import React, { useId, useMemo } from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import { useForm } from './FormControl';
import type { Presettable } from '../types';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface TextFieldCommon extends Presettable {
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
}

export type TextFieldProps =
  | (TextFieldCommon & InputProps & { as?: 'input'; rows?: never })
  | (TextFieldCommon & TextareaProps & { as: 'textarea' });

export const TextField: React.FC<TextFieldProps> = ({
  as = 'input',
  name,
  label,
  helperText,
  error = false,
  preset: p,
  className,
  autoFocus,
  rows,
  ...rest
}) => {
  const id = useId();
  const { theme } = useTheme();

  let form: ReturnType<typeof useForm<any>> | null = null;
  try {
    form = useForm<any>();
  } catch {}

  const value = form ? form.values[name] ?? '' : (rest as any).value;
  const setField = form ? form.setField : undefined;

  const Wrapper = useMemo(
    () => styled('div')`
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing.sm};
    `,
    [theme.spacing.sm]
  );

  const Field = useMemo(
    () =>
      styled(as === 'textarea' ? 'textarea' : 'input')`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        border: 1px solid
          ${error ? theme.colors.secondary : theme.colors.text}44;
        border-radius: 4px;
        background: ${theme.colors.background};
        color: ${theme.colors.text};
        font-size: 0.875rem;
        width: 100%;
        resize: ${as === 'textarea' ? 'vertical' : 'none'};
        &:focus {
          outline: 2px solid ${theme.colors.primary};
          outline-offset: 1px;
        }
      `,
    [
      as,
      error,
      theme.spacing.sm,
      theme.spacing.md,
      theme.colors.secondary,
      theme.colors.text,
      theme.colors.background,
      theme.colors.primary,
    ]
  );

  const Label = useMemo(
    () => styled('label')`
      font-size: 0.75rem;
      color: ${theme.colors.text};
    `,
    [theme.colors.text]
  );

  const Helper = useMemo(
    () => styled('span')`
      font-size: 0.75rem;
      color: ${error ? theme.colors.secondary : theme.colors.text}AA;
    `,
    [error, theme.colors.secondary, theme.colors.text]
  );

  const presetClasses = p ? preset(p) : '';

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    if (setField) setField(name as any, e.target.value);
    (rest as any).onChange?.(e);
  };

  return (
    <Wrapper className={[presetClasses, className].filter(Boolean).join(' ')}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Field
        {...(rest as any)}
        id={id}
        name={name}
        value={value}
        autoFocus={autoFocus}
        rows={as === 'textarea' ? rows : undefined}
        onChange={handleChange}
      />
      {helperText && <Helper>{helperText}</Helper>}
    </Wrapper>
  );
};

export default TextField;

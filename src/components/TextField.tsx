// src/components/TextField.tsx
import React, { useId, useMemo } from 'react';
import { styled } from '../css/createStyled';
import { useTheme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';
import { useForm } from './FormControl';

/*───────────────────────────────────────────────────────────────*/
/* Prop types                                                    */

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface TextFieldCommon extends Presettable {
  /** Field name inside the parent form store. */
  name: string;
  /** Optional floating label text. */
  label?: string;
  /** Helper or error copy rendered below the input. */
  helperText?: string;
  /** Visual error state. */
  error?: boolean;
}

/**
 * **TextFieldProps** – supports `<input>` _or_ `<textarea>`
 *
 * - `as`    → `'textarea'` to render a multiline field
 * - `rows`  → `textarea`-only convenience
 */
export type TextFieldProps =
  | (TextFieldCommon &
      InputProps & {
        as?: 'input';
        rows?: never;
      })
  | (TextFieldCommon &
      TextareaProps & {
        as: 'textarea';
      });

/*───────────────────────────────────────────────────────────────*/
/* Component                                                     */

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

  /* Grab the nearest form store if we’re inside <FormControl>. */
  let form: ReturnType<typeof useForm<any>> | null = null;
  try {
    form = useForm<any>();
  } catch {
    /* stand-alone mode – no provider */
  }

  const value = form ? form.values[name] ?? '' : (rest as any).value;
  const setField = form ? form.setField : undefined;

  /*──────────────────────────────*/
  /* Styled shells                */

  const Wrapper = useMemo(
    () =>
      styled('div')`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.sm};
      `,
    [theme.spacing.sm]
  );

  /** 
   * Memoise the **exact** Field component so its identity
   * doesn’t change on each render – eliminating the re-mount
   * that caused `autoFocus` to trigger again.
   */
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
    () =>
      styled('label')`
        font-size: 0.75rem;
        color: ${theme.colors.text};
      `,
    [theme.colors.text]
  );

  const Helper = useMemo(
    () =>
      styled('span')`
        font-size: 0.75rem;
        color: ${error ? theme.colors.secondary : theme.colors.text}AA;
      `,
    [error, theme.colors.secondary, theme.colors.text]
  );

  /*──────────────────────────────*/
  /* Class composition & handlers */

  const presetClasses = p ? preset(p) : '';

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    if (setField) setField(name as any, e.target.value);
    (rest as any).onChange?.(e);
  };

  /*──────────────────────────────*/
  /* Render                       */

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

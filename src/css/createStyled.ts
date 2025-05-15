// src/css/createStyled.ts
import React from 'react';
import hash from '@emotion/hash';

const styleCache = new Map<string, string>();

export function styled<Tag extends keyof JSX.IntrinsicElements>(tag: Tag) {
  return (
    strings: TemplateStringsArray,
    ...exprs: any[]
  ): React.FC<JSX.IntrinsicElements[Tag] & { className?: string }> => {
    const rawCSS = strings
      .map((s, i) => `${s}${exprs[i] ?? ''}`)
      .join('');
    const className = `z-${hash(rawCSS)}`;

    return (props) => {
      // inject once
      if (!styleCache.has(className)) {
        const style = document.createElement('style');
        style.textContent = `.${className}{${rawCSS}}`;
        document.head.appendChild(style);
        styleCache.set(className, rawCSS);
      }

      return React.createElement(tag, {
        ...props,
        className: [className, props.className].filter(Boolean).join(' '),
      });
    };
  };
}

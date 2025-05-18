import React from 'react';
import hash from '@emotion/hash';

const styleCache = new Map<string, string>();

/*───────────────────────────────────────────────────────────*/
/** Remove props that start with '$' so they don't hit the DOM */
function filterStyledProps<P extends Record<string, any>>(raw: P) {
  const clean: Record<string, any> = {};
  for (const k in raw) if (!k.startsWith('$')) clean[k] = raw[k];
  return clean;
}

/*───────────────────────────────────────────────────────────*/
/** ZeroUI’s lightweight `styled` with prop interpolation    */
export function styled<Tag extends keyof JSX.IntrinsicElements>(tag: Tag) {
  return function styledFactory<ExtraProps = {}>(
    strings: TemplateStringsArray,
    ...exprs: Array<
      | string
      | number
      | false
      | null
      | undefined
      | ((props: ExtraProps & JSX.IntrinsicElements[Tag]) => string | number | false | null | undefined)
    >
  ) {
    type StyledProps = ExtraProps &
      JSX.IntrinsicElements[Tag] & {
        className?: string;
      };

    const StyledComponent: React.FC<StyledProps> = (props) => {
      /* Build final CSS for THESE props */
      let css = '';
      for (let i = 0; i < strings.length; i++) {
        css += strings[i];
        if (i < exprs.length) {
          const piece = exprs[i];
          const val =
            typeof piece === 'function'
              ? (piece as any)(props) // prop-driven
              : piece;
          css += val ?? '';
        }
      }

      /* Cache & inject */
      let className = styleCache.get(css);
      if (!className) {
        className = `z-${hash(css)}`;
        const styleTag = document.createElement('style');
        styleTag.textContent = `.${className}{${css}}`;
        document.head.appendChild(styleTag);
        styleCache.set(css, className);
      }

      const mergedClass = [className, props.className].filter(Boolean).join(' ');
      const domProps = filterStyledProps(props);

      return React.createElement(tag, {
        ...domProps,
        className: mergedClass,
      });
    };

    return StyledComponent;
  };
}

export { styleCache };

// ─────────────────────────────────────────────────────────────
// src/components/Surface.tsx
// ZeroUI <Surface /> – optional non-fullscreen mode for docs / partial layouts
// ─────────────────────────────────────────────────────────────
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Breakpoint, useTheme } from '../system/themeStore';
import { preset } from '../css/stylePresets';
import type { Presettable } from '../types';

/*───────────────────────────────────────────────────────────*/
/** Context value returned by `useSurface()` */
export interface SurfaceContext {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  hasScrollbar: boolean;
}

const SurfaceCtx = createContext<SurfaceContext | null>(null);

/*───────────────────────────────────────────────────────────*/
/** Public prop type for Surface */
export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Presettable {
  /** Fill the entire viewport when `true` (default). */
  fullscreen?: boolean;
}

/*───────────────────────────────────────────────────────────*/
export const Surface: React.FC<SurfaceProps> = ({
  children,
  style,
  preset: p,
  className,
  fullscreen = true,          // ← new prop with default “on”
  ...props
}) => {
  const ref           = useRef<HTMLDivElement>(null);
  const { theme }     = useTheme();
  const presetClasses = p ? preset(p) : '';

  /* ----- viewport metrics ---------------------------------------------- */
  const [state, setState] = useState<SurfaceContext>({
    width: 0,
    height: 0,
    breakpoint: 'xs',
    hasScrollbar: false,
  });

  const bpFor = (w: number): Breakpoint =>
    (Object.entries(theme.breakpoints) as [Breakpoint, number][])
      .reduce<Breakpoint>((acc, [key, min]) => (w >= min ? key : acc), 'xs');

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setState({
        width,
        height,
        hasScrollbar:
          node.scrollHeight > node.clientHeight ||
          node.scrollWidth  > node.clientWidth,
        breakpoint: bpFor(width),
      });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [theme.breakpoints]);

  /* ----- default styles & smart-colour vars ---------------------------- */
  const defaults: React.CSSProperties = {
    background: theme.colors.background,
    color     : theme.colors.text,
  };

  const cssVars: React.CSSProperties = {
    '--zero-bg'        : defaults.background,
    '--zero-text-color': defaults.color,
  } as any;

  /* ----- layout styles -------------------------------------------------- */
  const layoutStyles: React.CSSProperties = fullscreen
    ? {
        position: 'fixed',
        inset: 0,
        paddingTop   : 'env(safe-area-inset-top)',
        paddingRight : 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft  : 'env(safe-area-inset-left)',
        overflow: 'auto',
      }
    : {
        width: '100%',
        height: 'auto',
        position: 'relative',
      };

  return (
    <SurfaceCtx.Provider value={state}>
      <div
        ref={ref}
        className={[presetClasses, className].filter(Boolean).join(' ')}
        style={{
          ...layoutStyles,
          ...defaults,
          ...cssVars,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </SurfaceCtx.Provider>
  );
};

export default Surface;

/*───────────────────────────────────────────────────────────*/
export const useSurface = () => {
  const ctx = useContext(SurfaceCtx);
  if (!ctx)
    throw new Error('useSurface must be used within a <Surface> component');
  return ctx;
};

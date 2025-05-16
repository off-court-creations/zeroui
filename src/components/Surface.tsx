// src/components/Surface.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Breakpoint, useTheme } from '../system/themeStore';

/** Context value returned by `useSurface()` */
export interface SurfaceContext {
  /** Current content width (inside safe-area padding). */
  width: number;
  /** Current content height (inside safe-area padding). */
  height: number;
  /** Active breakpoint derived from theme. */
  breakpoint: Breakpoint;
  /** `true` if overflow causes a scrollbar. */
  hasScrollbar: boolean;
}

const SurfaceCtx = createContext<SurfaceContext | null>(null);

/**
 * **Surface** – the viewport-filling root container for ZeroUI apps.
 *
 * It automatically:
 * 1. Occupies the full safe-area of the device (`position: fixed; inset: 0`)
 * 2. Adds `env(safe-area-inset-*)` padding to avoid notches & sensors
 * 3. Observes its own size with `ResizeObserver`, exposing:
 *    - `width` / `height`
 *    - current `breakpoint` (theme-driven)
 *    - `hasScrollbar` boolean
 *
 * This data is provided via `useSurface()` so any child (e.g. `Typography`)
 * can respond to viewport changes without prop drilling.
 *
 * @component
 *
 * @example <caption>Basic usage</caption>
 * ```tsx
 * <Surface style={{ background: '#fafafa' }}>
 *   <Stack spacing="md">
 *     <Typography variant="h1">Hello!</Typography>
 *   </Stack>
 * </Surface>
 * ```
 *
 * @example <caption>Consuming the context</caption>
 * ```tsx
 * const { breakpoint, hasScrollbar } = useSurface();
 * ```
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props All native div props + optional inline style.
 * @returns {JSX.Element} A viewport-fixed wrapper that provides responsive context.
 */
export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [state, setState] = useState<SurfaceContext>({
    width: 0,
    height: 0,
    breakpoint: 'xs',
    hasScrollbar: false,
  });

  // Derive breakpoint from width using theme tokens
  const getBreakpoint = (width: number): Breakpoint => {
    const entries = Object.entries(theme.breakpoints) as [
      Breakpoint,
      number
    ][];
    return entries.reduce<Breakpoint>(
      (prev, [key, min]) => (width >= min ? key : prev),
      'xs'
    );
  };

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const hasScroll =
        node.scrollHeight > node.clientHeight ||
        node.scrollWidth > node.clientWidth;
      setState({
        width,
        height,
        hasScrollbar: hasScroll,
        breakpoint: getBreakpoint(width),
      });
    });

    ro.observe(node);
    return () => ro.disconnect();
  }, [theme.breakpoints]);

  return (
    <SurfaceCtx.Provider value={state}>
      <div
        ref={ref}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          overflow: 'auto',
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

/* ------------------------------------------------------------------ */
/** Hook for consuming the current Surface state */
export const useSurface = () => {
  const ctx = useContext(SurfaceCtx);
  if (!ctx)
    throw new Error('useSurface must be used within a <Surface> component');
  return ctx;
};

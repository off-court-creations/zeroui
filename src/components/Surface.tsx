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
/** Context & state */
export interface SurfaceContext {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  hasScrollbar: boolean;
}

const SurfaceCtx = createContext<SurfaceContext | null>(null);

/*───────────────────────────────────────────────────────────*/
/** Props */
export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Presettable {}

/*───────────────────────────────────────────────────────────*/
/** Component */
export const Surface: React.FC<SurfaceProps> = ({
  children,
  style,
  preset: p,
  className,
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

  /* Breakpoint resolver */
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

  /* ResizeObserver */
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

  const presetClasses = p ? preset(p) : '';

  /* Default background if none supplied */
  const defaultBg =
    !style?.background && !style?.backgroundColor
      ? { background: theme.colors.background }
      : undefined;

  return (
    <SurfaceCtx.Provider value={state}>
      <div
        ref={ref}
        className={[presetClasses, className].filter(Boolean).join(' ')}
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
          ...defaultBg,
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
/** Hook */
export const useSurface = () => {
  const ctx = useContext(SurfaceCtx);
  if (!ctx)
    throw new Error('useSurface must be used within a <Surface> component');
  return ctx;
};

// src/components/Surface.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Breakpoint, useTheme } from '../system/themeStore';

interface SurfaceContext {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  hasScrollbar: boolean;
}
const SurfaceCtx = createContext<SurfaceContext | null>(null);

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

  const getBreakpoint = (width: number): Breakpoint => {
    const entries = Object.entries(theme.breakpoints) as [Breakpoint, number][];
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
      const bp = getBreakpoint(width);
      setState({ width, height, breakpoint: bp, hasScrollbar: hasScroll });
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

export const useSurface = () => {
  const ctx = useContext(SurfaceCtx);
  if (!ctx) throw new Error('useSurface must be used within <Surface>');
  return ctx;
};
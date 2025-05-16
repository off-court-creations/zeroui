// src/system/themeStore.ts
import { create } from 'zustand';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ThemeMode  = 'light' | 'dark';

/*───────────────────────────────────────────────────────────*/
/** Complete design-system contract. */
export interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<Breakpoint, number>;
  typography: Record<string, Record<Breakpoint, string>>;
}

/** Zustand store contract. */
interface ThemeStore {
  mode: ThemeMode;
  theme: Theme;

  /** Swap the entire mode (light ↔ dark). */
  setMode: (m: ThemeMode) => void;
  /** Convenience flip helper. */
  toggleMode: () => void;

  /** Patch arbitrary theme values (e.g., brand color overrides). */
  setTheme: (patch: Partial<Theme>) => void;
}

/*───────────────────────────────────────────────────────────*/
/** Shared non-color tokens (identical for both modes). */
const common: Omit<Theme, 'colors'> = {
  spacing:   { sm: '4px', md: '8px', lg: '16px' },
  breakpoints: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  typography: {
    h1:       { xs: '2rem',    sm: '2.25rem', md: '2.5rem',  lg: '3rem',    xl: '3.5rem' },
    h2:       { xs: '1.75rem', sm: '2rem',    md: '2.25rem', lg: '2.5rem',  xl: '3rem'   },
    h3:       { xs: '1.5rem',  sm: '1.75rem', md: '2rem',    lg: '2.25rem', xl: '2.5rem' },
    h4:       { xs: '1.25rem', sm: '1.5rem',  md: '1.75rem', lg: '2rem',    xl: '2.25rem' },
    h5:       { xs: '1rem',    sm: '1.25rem', md: '1.5rem',  lg: '1.75rem', xl: '2rem'   },
    h6:       { xs: '0.875rem',sm: '1rem',    md: '1.25rem', lg: '1.5rem',  xl: '1.75rem' },
    body:     { xs: '0.875rem',sm: '1rem',    md: '1.125rem',lg: '1.25rem', xl: '1.5rem' },
    subtitle: { xs: '0.75rem', sm: '0.875rem',md: '1rem',    lg: '1.125rem',xl: '1.25rem' },
  },
};

/** Color palettes */
const lightColors = {
  primary:   '#62AEE4',
  secondary: '#F7C0A1',
  tertiary:  '#9AE5E6',
  background:'#FFFFFF',
  backgroundAlt:'#CCCCCC',
  text:      '#111111',
} as const;

const darkColors = {
  primary:   '#0D324D',
  secondary: '#EF8243',
  tertiary:  '#4BD0D2',
  background:'#222222',
  backgroundAlt: '#CCCCCC',
  text:      '#EEEEEE',
} as const;

/*───────────────────────────────────────────────────────────*/
export const useTheme = create<ThemeStore>((set, get) => ({
  mode:  'dark',                                // ← default mode
  theme: { ...common, colors: darkColors },

  setMode: (mode) =>
    set(() => ({
      mode,
      theme: { ...common, colors: mode === 'light' ? lightColors : darkColors },
    })),

  toggleMode: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    get().setMode(next);
  },

  /* Non-mode granular overrides */
  setTheme: (patch) =>
    set((state) => ({ theme: { ...state.theme, ...patch } })),
}));

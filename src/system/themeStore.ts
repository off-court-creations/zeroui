import { create } from 'zustand';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ThemeName  = 'light' | 'dark' | (string & {});

/*───────────────────────────────────────────────────────────*/
/** Design-system contract. */
export interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<Breakpoint, number>;
  typography: Record<string, Record<Breakpoint, string>>;
}

/*───────────────────────────────────────────────────────────*/
/** Zustand store contract. */
interface ThemeStore {
  mode: ThemeName;
  theme: Theme;
  themes: Record<ThemeName, Theme>;

  setMode: (name: ThemeName) => void;
  toggleMode: () => void;

  setTheme: (patch: Partial<Theme>) => void;
  registerTheme: (name: ThemeName, theme: Partial<Theme>) => void;
  applyTheme: (name: ThemeName, theme: Partial<Theme>) => void;
}

/*───────────────────────────────────────────────────────────*/
/** Shared tokens. */
const common: Omit<Theme, 'colors'> = {
  spacing:   { sm: '4px', md: '8px', lg: '16px' },
  breakpoints: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  typography: {
    h1:{xs:'2rem',sm:'2.25rem',md:'2.5rem',lg:'3rem',xl:'3.5rem'},
    h2:{xs:'1.75rem',sm:'2rem',md:'2.25rem',lg:'2.5rem',xl:'3rem'},
    h3:{xs:'1.5rem',sm:'1.75rem',md:'2rem',lg:'2.25rem',xl:'2.5rem'},
    h4:{xs:'1.25rem',sm:'1.5rem',md:'1.75rem',lg:'2rem',xl:'2.25rem'},
    h5:{xs:'1rem',sm:'1.25rem',md:'1.5rem',lg:'1.75rem',xl:'2rem'},
    h6:{xs:'0.875rem',sm:'1rem',md:'1.25rem',lg:'1.5rem',xl:'1.75rem'},
    body:{xs:'0.875rem',sm:'1rem',md:'1.125rem',lg:'1.25rem',xl:'1.5rem'},
    subtitle:{xs:'0.75rem',sm:'0.875rem',md:'1rem',lg:'1.125rem',xl:'1.25rem'},
  },
};

/*───────────────────────────────────────────────────────────*/
/** Core palettes (now with *Text* keys). */
const lightColors = {
  primary:'#62AEE4',   primaryText:'#FFFFFF',
  secondary:'#F7C0A1', secondaryText:'#111111',
  tertiary:'#9AE5E6',  tertiaryText:'#111111',
  background:'#FFFFFF',
  backgroundAlt:'#CCCCCC',
  text:'#111111',
} as const;

const darkColors = {
  primary:'#0D324D',   primaryText:'#FFFFFF',
  secondary:'#EF8243', secondaryText:'#111111',
  tertiary:'#4BD0D2',  tertiaryText:'#111111',
  background:'#222222',
  backgroundAlt:'#444444',
  text:'#EEEEEE',
} as const;

/* Helper */
const buildTheme = (partial: Partial<Theme>): Theme => ({
  ...common,
  ...partial,
  colors: { ...((partial.colors as any) ?? {}) },
});

/*───────────────────────────────────────────────────────────*/
export const useTheme = create<ThemeStore>((set, get) => ({
  themes: {
    light: buildTheme({ colors: lightColors }),
    dark:  buildTheme({ colors: darkColors }),
  },

  mode:  'dark',
  theme: buildTheme({ colors: darkColors }),

  setMode: (name) =>
    set((state) => {
      const t = state.themes[name];
      if (!t) return state;
      return { mode: name, theme: t };
    }),

  toggleMode: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    get().setMode(next);
  },

  setTheme: (patch) =>
    set((state) => {
      const updated = {
        ...state.theme,
        ...patch,
        colors: { ...state.theme.colors, ...(patch.colors ?? {}) },
      };
      return {
        theme: updated,
        themes: { ...state.themes, [state.mode]: updated },
      };
    }),

  registerTheme: (name, partial) =>
    set((state) => ({
      themes: { ...state.themes, [name]: buildTheme(partial) },
    })),

  applyTheme: (name, partial) =>
    set((state) => {
      const full = buildTheme(partial);
      return {
        mode: name,
        theme: full,
        themes: { ...state.themes, [name]: full },
      };
    }),
}));

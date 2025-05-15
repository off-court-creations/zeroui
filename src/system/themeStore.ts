// src/system/themeStore.ts
import { create } from 'zustand';

interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
}

interface ThemeStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: {
    colors: { primary: '#000', background: '#fff' },
    spacing: { sm: '4px', md: '8px', lg: '16px' },
  },
  setTheme: (theme) => set({ theme }),
}));

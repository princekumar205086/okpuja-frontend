import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggleTheme: () => set((state) => { 
        const newMode = state.mode === 'light' ? 'dark' : 'light';
        // Apply immediately to HTML element
        if (typeof document !== 'undefined') {
          const htmlElement = document.documentElement;
          const bodyElement = document.body;
          if (newMode === 'dark') {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark');
          } else {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark');
          }
        }
        return { mode: newMode };
      }),
      setTheme: (mode) => {
        // Apply immediately to HTML element
        if (typeof document !== 'undefined') {
          const htmlElement = document.documentElement;
          const bodyElement = document.body;
          if (mode === 'dark') {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark');
          } else {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark');
          }
        }
        set({ mode });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme when rehydrating from storage
        if (state && typeof document !== 'undefined') {
          const htmlElement = document.documentElement;
          const bodyElement = document.body;
          if (state.mode === 'dark') {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark');
          } else {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark');
          }
        }
      }
    }
  )
);

/* eslint-disable react-refresh/only-export-components */
import { createCTX } from '@/helpers';
import { useEffect, type PropsWithChildren } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const getColorSchemeMedia = () => matchMedia('(prefers-color-scheme: dark)');

export const { context: ThemeContext, hook: useTheme } = createCTX<{
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  resolvedTheme: 'light' | 'dark';
}>('Theme');

export type Theme = 'light' | 'dark' | 'system';

const ThemeProvider = ({
  children,
  defaultTheme = 'system',
}: PropsWithChildren<{ defaultTheme?: Theme }>) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', defaultTheme);

  const resolvedTheme =
    theme === 'system'
      ? getColorSchemeMedia().matches
        ? 'dark'
        : 'light'
      : theme;

  useEffect(() => {
    if (theme !== 'system') return;

    const colorSchemeMedia = getColorSchemeMedia();

    const listener = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? 'dark' : 'light');

    colorSchemeMedia.addEventListener('change', listener);

    return () => {
      colorSchemeMedia.removeEventListener('change', listener);
    };
  }, [setTheme, theme]);

  useEffect(() => {
    const classList = document.documentElement.classList;

    if (resolvedTheme === 'dark') classList.add('dark');
    else classList.remove('dark');
  }, [resolvedTheme]);

  return (
    <ThemeContext value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext>
  );
};

export default ThemeProvider;

import { PropsWithChildren, useMemo } from 'react';
import {
  createTheme,
  ThemeProvider as ThemedThemeProvider,
} from '@rneui/themed';

type ThemeProviderProps = PropsWithChildren<{ theme: 'light' | 'dark' }>;

const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  const themeObj = useMemo(() => createTheme({ mode: theme }), [theme]);

  return <ThemedThemeProvider theme={themeObj}>{children}</ThemedThemeProvider>;
};

export default ThemeProvider;

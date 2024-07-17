import { Stack } from 'expo-router';
import {
  ThemeProvider as NavThemeProvider,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/components/ui-kit/core';

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  return (
    <ThemeProvider theme={theme}>
      <NavThemeProvider value={isDark ? NavDarkTheme : NavDefaultTheme}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </NavThemeProvider>
    </ThemeProvider>
  );
}

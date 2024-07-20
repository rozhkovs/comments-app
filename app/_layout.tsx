import { Stack } from 'expo-router';
import {
  ThemeProvider as NavThemeProvider,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Provider as StoreProvider } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/components/ui-kit/core';
import store from '@/store';
import '@/shared/localization';

export default function RootLayout() {
  const { t } = useTranslation(['signup']);
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <NavThemeProvider value={isDark ? NavDarkTheme : NavDefaultTheme}>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen
              name="sign-up"
              options={{ title: t('signup:title') }}
            />
          </Stack>
        </NavThemeProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

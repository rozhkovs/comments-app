import { Redirect, Stack } from 'expo-router';
import { getCurUserSelector, useAppSelector } from '@/store';

export default function AppLayout() {
  const user = useAppSelector(getCurUserSelector);

  if (!user) {
    return <Redirect href="/sign-up" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}

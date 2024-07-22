import { Redirect, Stack } from 'expo-router';
import { getCurUserSelector, useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import { CommentAddHeaderRightButton } from '@/widgets/comment';
import { SignOutIconButton } from '@/widgets/auth';

export default function AppLayout() {
  const { t } = useTranslation(['comment']);
  const user = useAppSelector(getCurUserSelector);

  if (!user) {
    return <Redirect href="/sign-up" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('title'),
          headerLeft: () => <SignOutIconButton />,
          headerRight: () => <CommentAddHeaderRightButton />,
        }}
      />
    </Stack>
  );
}

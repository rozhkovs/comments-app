import { useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Platform } from 'expo-modules-core';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import { makeStyles, Button, View } from '@/components/ui-kit/core';
import { FormInput } from '@/components/ui-kit/form';
import { useStableCallback } from '@/shared/utils/react-useful-hooks';
import { signUp, UserSignUp } from '@/store/auth';
import { useAppDispatch } from '@/store';
import { checkFormatEmail, checkFormatName } from '@/shared/user';

export default function SignUp() {
  const { t } = useTranslation('signup');
  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();

  const { control, handleSubmit } = useForm<UserSignUp>({
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const styles = useStyles();

  const onSignUpPress = useStableCallback(() => {
    handleSubmit(
      async (data) => {
        await dispatch(signUp(data));
        router.replace('/');
      },
      () => {
        Alert.alert(t('alert.notValid'));
      },
    )();
  });

  const emailRules = useMemo(
    () => ({
      required: t('input.email.required'),
      validate: (value: string) =>
        checkFormatEmail(value) || t('input.email.invalidFormat'),
    }),
    [t],
  );
  const nameRules = useMemo(
    () => ({
      required: t('input.name.required'),
      validate: (value: string) =>
        checkFormatName(value) || t('input.name.invalidFormat'),
    }),
    [t],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={'handled'}>
          <FormInput
            control={control}
            name={'email'}
            label={t('input.email.label')}
            placeholder={t('input.email.placeholder')}
            keyboardType={'email-address'}
            autoFocus={true}
            autoCapitalize={'none'}
            rules={emailRules}
          />
          <FormInput
            control={control}
            name={'name'}
            label={t('input.name.label')}
            placeholder={t('input.name.placeholder')}
            rules={nameRules}
          />
          <View style={styles.spacer} />
          <Button
            style={styles.button}
            title={t('button.signup')}
            onPress={onSignUpPress}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
}));

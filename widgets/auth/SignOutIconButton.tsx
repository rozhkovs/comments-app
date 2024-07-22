import React, { memo } from 'react';
import { signOut, useAppDispatch } from '@/store';
import { Icon } from '@/shared/ui-kit/core';

const SignOutIconButton = () => {
  const dispatch = useAppDispatch();
  const onPress = () => {
    dispatch(signOut());
  };

  return <Icon name="logout" type="material" onPress={onPress} />;
};

export default memo(SignOutIconButton);

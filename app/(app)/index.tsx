import { Button } from '@/components/ui-kit/core';
import { signOut, useAppDispatch } from '@/store';

export default function Index() {
  const dispatch = useAppDispatch();

  return (
    <Button
      title={'Sign out'}
      onPress={() => {
        dispatch(signOut());
      }}
    />
  );
}

import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  cancelWritingNewComment,
  Comment,
  CommentCreate,
  createComment,
} from '@/store/comment';
import { Button, makeStyles } from '@/components/ui-kit/core';
import { FormInput } from '@/components/ui-kit/form';
import { getCurUserSelector, useAppDispatch, useAppSelector } from '@/store';
import { useStableCallback } from '@/shared/utils/react-useful-hooks';
import { isEmptyString } from '@/shared/utils/string';

type CommentCreateListItemProps = {
  replyParentId: Comment['replyParentId'];
};

const CommentCreateListItem = ({
  replyParentId,
}: CommentCreateListItemProps) => {
  const { t } = useTranslation('comment');
  const user = useAppSelector(getCurUserSelector);
  const dispatch = useAppDispatch();

  const { control, handleSubmit } = useForm<CommentCreate>({
    defaultValues: {
      message: '',
      userId: user?.id,
      replyParentId,
    },
  });

  const messageRules = useMemo(
    () => ({
      validate: (value: string) =>
        !isEmptyString(value) || t('input.message.required'),
    }),
    [t],
  );

  const publish = useStableCallback(() => {
    handleSubmit((data) => {
      dispatch(createComment(data));
    })();
  });

  const cancel = useStableCallback(() => {
    dispatch(cancelWritingNewComment(replyParentId));
  });

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <FormInput
        control={control}
        name={'message'}
        placeholder={t('input.message.placeholder')}
        rules={messageRules}
        multiline={true}
        autoFocus={true}
      />
      <View style={styles.buttonContainer}>
        <Button title={t('button.publish')} onPress={publish} />
        <Button
          title={t('button.cancel')}
          onPress={cancel}
          color={'secondary'}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
}));

export default memo(CommentCreateListItem);

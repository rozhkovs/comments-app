import React from 'react';
import { Icon } from '@/shared/ui-kit/core';
import { startWritingNewComment, useAppDispatch } from '@/store';

const CommentAddIconButton = () => {
  const dispatch = useAppDispatch();
  const onPress = () => {
    dispatch(startWritingNewComment(null));
  };

  return <Icon name="add" type="material" onPress={onPress} />;
};

export default CommentAddIconButton;

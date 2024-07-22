import { memo } from 'react';
import {
  FieldValues,
  useController,
  FieldPath,
  UseControllerProps,
} from 'react-hook-form';
import { Input, InputProps } from '@/shared/ui-kit/core';

type FormInputProps<
  FieldValuesT extends FieldValues,
  NameT extends FieldPath<FieldValuesT>,
> = Omit<InputProps, 'value'> &
  Pick<
    UseControllerProps<FieldValuesT, NameT>,
    'control' | 'name' | 'defaultValue' | 'rules'
  >;

const FormInput = <
  FieldValuesT extends FieldValues,
  NameT extends FieldPath<FieldValuesT>,
>({
  control,
  name,
  rules,
  defaultValue,
  errorMessage: errorMessageProp,
  onChangeText: onChangeTextProp,
  ...rest
}: FormInputProps<FieldValuesT, NameT>) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
    defaultValue,
  });

  const onChangeText = (text: string) => {
    onChangeTextProp?.(text);
    field.onChange(text);
  };

  const errorMessage = fieldState.error?.message ?? errorMessageProp;

  return (
    <Input
      {...rest}
      value={field.value}
      onChangeText={onChangeText}
      errorMessage={errorMessage}
    />
  );
};

export default memo(FormInput) as typeof FormInput;

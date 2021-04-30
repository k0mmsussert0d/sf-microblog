import React, {ReactElement} from 'react';
import {FieldError, FieldValues, useController, UseControllerProps} from 'react-hook-form';
import {Help, Input} from 'rbx';

export const ControlledInput = <T extends FieldValues>(props: ControlledInputProps<T>): ReactElement<ControlledInputProps<T>> => {
  const {field, fieldState} = useController(props);

  return (
    <>
      <Input
        {...field}
        placeholder={props.placeholder}
        type={props.type ?? 'text'}
        color={fieldState.invalid ? 'danger' : undefined}
      />
      {props.error && <Help color='danger'>{props.error.message}</Help>}
    </>
  );
};

export interface ControlledInputProps<T> extends UseControllerProps<T> {
  type?: 'number' | 'time' | 'text' | 'color' | 'date' | 'search' | 'email' | 'tel' | 'password' | undefined,
  placeholder?: string
  error?: FieldError | undefined
}

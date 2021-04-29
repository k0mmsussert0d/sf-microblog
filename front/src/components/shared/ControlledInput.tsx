import React, {ReactElement} from 'react';
import {FieldError, useController, UseControllerProps} from 'react-hook-form';
import {Help, Input} from 'rbx';
import {SignUpFormForms} from '../signup/SignUpForm';

export const ControlledInput: React.FC<ControlledInputProps> = (props: ControlledInputProps): ReactElement => {
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

export interface ControlledInputProps extends UseControllerProps<SignUpFormForms> {
  type?: 'number' | 'time' | 'text' | 'color' | 'date' | 'search' | 'email' | 'tel' | 'password' | undefined,
  placeholder?: string
  error?: FieldError | undefined
}

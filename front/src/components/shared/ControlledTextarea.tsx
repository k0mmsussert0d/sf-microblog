import React, {ReactElement} from 'react';
import {FieldError, FieldValues, useController, UseControllerProps} from 'react-hook-form';
import { Textarea, Help } from 'rbx';
import {TextareaProps} from 'rbx/elements/form/textarea';

export const ControlledTextarea = <T extends FieldValues>(props: ControlledTextareaProps<T>): ReactElement => {
  const {field, fieldState} = useController(props);

  return (
    <>
      <Textarea
        {...field}
        placeholder={props.placeholder}
        color={fieldState.invalid ? 'danger' : (props.color ?? undefined)}
      />
      {props.error && <Help color='danger'>{props.error.message}</Help>}
    </>
  );
};

export interface ControlledTextareaProps<T> extends UseControllerProps<T>, TextareaProps {
  error?: FieldError | undefined
  placeholder?: string
}

export default ControlledTextarea;

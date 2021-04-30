import React, {useState} from 'react';
import {Message, SignUpParams} from '../../models/UI';
import {FieldValues, useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';
import {Redirect} from 'react-router-dom';
import {Field, Button, Control, Generic, Help, Icon} from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faKey} from '@fortawesome/free-solid-svg-icons';
import {ControlledInput} from '../shared/ControlledInput';
import {useAppContext} from '../../utils/contextLib';

export interface ConfirmationFormForms {
  code: string
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({newUser}: ConfirmationFormProps) => {

  const {control, handleSubmit, formState: {errors}} = useForm<ConfirmationFormForms>();
  const [apiError, setApiError] = useState<Message | undefined>(undefined);
  const {isAuthenticated, userHasAuthenticated} = useAppContext();
  
  const handleSubmitConfirmation = async (data: ConfirmationFormForms) => {
    const code = data.code;
    try {
      await Auth.confirmSignUp(newUser.username, code);
      await Auth.signIn(newUser.username, newUser.password);

      userHasAuthenticated(true);
    } catch (e) {
      console.error(e);
      setApiError({
        text: e.message,
        type: 'error'
      });
    }
  };
  
  return (
    <>
      {isAuthenticated ?
        <Redirect to='/' /> :
        <form onSubmit={handleSubmit(handleSubmitConfirmation)}>
          <Field>
            <Control iconLeft>
              <ControlledInput<ConfirmationFormForms>
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Please enter confirmation code you received in an e-mail'
                  }
                }}
                name='code'
                placeholder='Confirmation code'
                error={errors.code}
              />
              <Icon align="left">
                <FontAwesomeIcon icon={faKey}/>
              </Icon>
            </Control>
          </Field>
          <Generic>
            <Button.Group>
              <Button color='primary' fullwidth type='submit'>Confirm</Button>
            </Button.Group>
            {apiError && <Help color='danger'>{apiError.text}</Help>}
          </Generic>
        </form>
      }
    </>
  );
};

export interface ConfirmationFormProps extends FieldValues {
  newUser: SignUpParams
}

export default ConfirmationForm;

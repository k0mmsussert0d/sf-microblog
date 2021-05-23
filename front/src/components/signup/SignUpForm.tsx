import React, {ReactElement, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Control, Field, Generic, Icon} from 'rbx';
import {ControlledInput} from '../shared/ControlledInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEnvelope, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import {Auth} from 'aws-amplify';
import {Message, SignUpParams} from '../../models/UI';


export interface SignUpFormForms {
  username: string,
  email: string,
  password: string,
  repeatpassword: string,
}

const SignUpForm: React.FC<SignUpFormProps> = ({setNewUser}: SignUpFormProps): ReactElement => {

  const {handleSubmit, control, getValues, formState: {errors}} = useForm<SignUpFormForms>();
  const [sendingRequest, setSendingRequest] = useState(false);
  const [resultMessage, setResultMessage] = useState<Message>({type: 'none'});

  const submitRegistrationForm = async (form: SignUpFormForms): Promise<void> => {
    if (form.password !== form.repeatpassword) {
      return;
    }

    const newUser: SignUpParams = {
      username: form.email,
      password: form.password,
      attributes: {
        preferred_username: form.username
      }
    };

    try {
      setSendingRequest(true);
      await Auth.signUp(newUser);
      setNewUser(newUser);
      setResultMessage({
        type: 'success',
        text: 'Successfully registered'
      });
    } catch (e) {
      console.error(e);
      setResultMessage({
        type: 'error',
        text: e?.message
      });
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitRegistrationForm)}>
      <Field>
        <Control iconLeft>
          <ControlledInput<SignUpFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Username is required'
              },
              minLength: {
                value: 3,
                message: 'Username must have at least 3 characters'
              },
              maxLength: {
                value: 20,
                message: 'Username must not have more than 20 characters'
              }
            }}
            name="username"
            placeholder="Username"
            error={errors.username}
          />
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={faUser} />
          </Icon>
        </Control>
      </Field>
      <Field>
        <Control iconLeft>
          <ControlledInput<SignUpFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'E-mail address is required'
              }
            }}
            name="email"
            type="email"
            placeholder="E-mail"
            error={errors.email}
          />
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={faEnvelope} />
          </Icon>
        </Control>
      </Field>

      <Field>
        <Control iconLeft>
          <ControlledInput<SignUpFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Password is required'
              },
              pattern: {
                value: RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
                message: 'Password must have at least 1 uppercase character, 1 lowercase character, 1 number and at least 8 characters in total'
              }
            }}
            name="password"
            type="password"
            placeholder="Password"
            error={errors.password}
          />
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={faLock} />
          </Icon>
        </Control>
      </Field>

      <Field>
        <Control iconLeft>
          <ControlledInput<SignUpFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Password is required'
              },
              validate: (pw: string) => {
                const {password} = getValues();
                return password === pw || 'Passwords don\'t match';
              }
            }}
            name="repeatpassword"
            type="password"
            placeholder="Repeat password"
            error={errors.repeatpassword}
          />
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={faLock} />
          </Icon>
        </Control>
      </Field>

      <Field as="div" className="custom-modal-bottom">
        <Generic as="div" className="custom-modal-error">
          {resultMessage &&
          <p style={{color: resultMessage.type === 'success' ? '#23d160' : '#ff3860'}}>{resultMessage.text}</p>
          }
        </Generic>
        <Control as="div" className="custom-modal-button">
          <Button.Group align="right">
            {sendingRequest ?
              <Button state="loading" color="success">Loading</Button> :
              <Button type="submit" color="success">Create account</Button>
            }
          </Button.Group>
        </Control>
      </Field>
    </form>
  );
};

export interface SignUpFormProps {
  setNewUser: (newUser: SignUpParams) => void
}

export default SignUpForm;

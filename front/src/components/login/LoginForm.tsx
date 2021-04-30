import React, {ReactElement, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Message} from '../../models/UI';
import {Auth} from 'aws-amplify';
import {Field, Control, Icon, Generic, Button} from 'rbx';
import {ControlledInput} from '../shared/ControlledInput';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';

interface LoginFormForms {
  email: string,
  password: string
}

const LoginForm: React.FC = (): ReactElement => {

  const {handleSubmit, control, formState: {errors}} = useForm<LoginFormForms>();
  const [sendingRequest, setSendingRequest] = useState(false);
  const [resultMessage, setResultMessage] = useState<Message>({type: 'none'});
  
  const submitLoginForm = async (form: LoginFormForms): Promise<void> => {
    try {
      setSendingRequest(true);
      await Auth.signIn({
        username: form.email,
        password: form.password
      });
      setResultMessage({
        type: 'success',
        text: 'Logged in'
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      console.error(e);
      setResultMessage({
        type: 'error',
        text: e.message ?? 'Could not authenticate'
      });
    } finally {
      setSendingRequest(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(submitLoginForm)}>
      <Field>
        <Control iconLeft>
          <ControlledInput<LoginFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'E-mail address is required'
              }
            }}
            name='email'
            type='email'
            placeholder='E-mail'
            error={errors.email}
          />
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={faEnvelope} />
          </Icon>
        </Control>
      </Field>

      <Field>
        <Control iconLeft>
          <ControlledInput<LoginFormForms>
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Password is required'
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
              <Button type="submit" color="success">Log in</Button>
            }
          </Button.Group>
        </Control>
      </Field>
    </form>
  );
};

export default LoginForm;

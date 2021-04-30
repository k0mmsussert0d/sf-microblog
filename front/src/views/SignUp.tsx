import React, {ReactElement, useState} from 'react';
import {SignUpParams} from '../models/UI';
import SignUpForm from '../components/signup/SignUpForm';
import ConfirmationForm from '../components/signup/ConfirmationForm';

const SignUp: React.FC = (): ReactElement => {
  const [newUser, setNewUser] = useState<SignUpParams | undefined>(undefined);

  return (
    <>
      {newUser == undefined ?
        <SignUpForm setNewUser={setNewUser} /> :
        <ConfirmationForm newUser={newUser} />
      }
    </>
  );
};

export default SignUp;

import React, {ReactElement, useState} from 'react';
import {SignUpParams} from '../models/UI';
import SignUpForm from '../components/signup/SignUpForm';

const SignUp: React.FC = (): ReactElement => {
  const [newUser, setNewUser] = useState<SignUpParams | undefined>(undefined);

  return (
    <>
      {newUser == undefined ?
        <SignUpForm setNewUser={setNewUser} /> :
        <strong>validating</strong>
      }
    </>
  );
};

export default SignUp;

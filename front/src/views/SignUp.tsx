import React, {ReactElement, useState} from 'react';
import {SignUpParams} from '../models/UI';
import SignUpForm from '../components/signup/SignUpForm';
import ConfirmationForm from '../components/signup/ConfirmationForm';
import {useAppContext} from '../utils/contextLib';
import {Redirect} from 'react-router-dom';

const SignUp: React.FC = (): ReactElement => {

  const [newUser, setNewUser] = useState<SignUpParams | undefined>(undefined);
  const {isAuthenticated} = useAppContext();

  return (
    <>
      {isAuthenticated ?
        <Redirect to='/' /> :
        (
          newUser == undefined ?
            <SignUpForm setNewUser={setNewUser} /> :
            <ConfirmationForm newUser={newUser} />
        )
      }
    </>
  );
};

export default SignUp;

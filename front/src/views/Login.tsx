import React, {ReactElement} from 'react';
import {useAppContext} from '../utils/contextLib';
import {Redirect} from 'react-router-dom';
import LoginForm from '../components/login/LoginForm';

const Login: React.FC = (): ReactElement => {

  const {isAuthenticated} = useAppContext();

  return (
    <>
      {isAuthenticated ?
        <Redirect to='/' /> :
        <LoginForm />
      }
    </>
  );
};

export default Login;

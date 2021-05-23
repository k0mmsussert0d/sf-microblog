import React, {ReactElement} from 'react';
import {Route, RouteProps} from 'react-router-dom';
import UnauthenticatedErrorPage from '../views/UnauthenticatedErrorPage';

export interface AuthenticatedRouteProps extends RouteProps {
  isAuthenticated: boolean
}

const AuthenticatedRoute = ({isAuthenticated, ...routeProps}: AuthenticatedRouteProps): ReactElement => {
  if (isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <UnauthenticatedErrorPage />;
  }
};

export default AuthenticatedRoute;

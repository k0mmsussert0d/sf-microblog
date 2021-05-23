import React, {ReactElement, useEffect, useState} from 'react';
import './App.scss';
import 'rbx/index.sass';
import {Auth} from 'aws-amplify';
import { AppContext } from './utils/contextLib';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './components/header/Header';
import {Generic} from 'rbx';
import Main from './views/Main';
import SignUp from './views/SignUp';
import Login from './views/Login';
import PostView from './views/PostView';
import AddPost from './views/AddPost';
import { UserSummary } from './models/API';
import Profile from './views/Profile';
import AuthenticatedRoute from './utils/AuthenticatedRoute';


const App: React.FC = (): ReactElement => {

  const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserSummary | undefined>(undefined);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    const onLoad = async() => {
      setIsAuthenticating(true);
      try {
        const user = await Auth.currentUserInfo();
        console.log(user);
        if (user) {
          userHasAuthenticated(true);
          setAuthenticatedUser({
            username: user.attributes.preferred_username,
            avatar: user.attributes.avatar ?? undefined,
            joined: new Date()
          });
        } else {
          userHasAuthenticated(false);
        }
      } catch (e) {
        if (e !== 'No current user') {
          console.error(e);
        }
      }
      setIsAuthenticating(false);
    };

    onLoad();
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      userHasAuthenticated: userHasAuthenticated,
      authenticatedUserDetails: authenticatedUser
    }}>
      <Router>
        <Header />
        <Generic as='div' className='main-wrapper'>
          <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/signup'>
              <SignUp />
            </Route>
            <AuthenticatedRoute
              path='/add'
              isAuthenticated={isAuthenticated}
              component={AddPost}
            />
            <Route path='/profile/:username' component={Profile} />
            <AuthenticatedRoute
              path='/profile'
              isAuthenticated={isAuthenticated}
              component={Profile}
            />
            <Route path='/:id' component={PostView} />
            <Route path='/'>
              <Main />
            </Route>
          </Switch>
        </Generic>
      </Router>
    </AppContext.Provider>
  );
};

export default App;

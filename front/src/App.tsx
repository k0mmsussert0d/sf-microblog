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


const App: React.FC = (): ReactElement => {

  const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserSummary | undefined>(undefined);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    const onLoad = async() => {
      setIsAuthenticating(true);
      try {
        const user = await Auth.currentUserInfo();
        userHasAuthenticated(true);
        setAuthenticatedUser({
          username: user.username,
          avatar: user.attributes.avatar ?? undefined,
          joined: new Date()
        });
      } catch (e) {
        if (e !== 'No current user') {
          console.error(e);
        }
      } finally {
        setIsAuthenticating(false);
      }
    };

    onLoad();
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      authenticatedUserDetails: authenticatedUser,
      userHasAuthenticated: userHasAuthenticated
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
            <Route path='/add'>
              <AddPost />
            </Route>
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

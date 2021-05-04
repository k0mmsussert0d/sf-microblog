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


const App: React.FC = (): ReactElement => {

  const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    const onLoad = async() => {
      setIsAuthenticating(true);
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
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
    <AppContext.Provider value={{isAuthenticated: isAuthenticated, userHasAuthenticated: userHasAuthenticated}}>
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

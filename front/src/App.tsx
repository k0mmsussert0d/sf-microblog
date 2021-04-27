import React, {ReactElement, useEffect, useState} from 'react';
import './App.scss';
import 'rbx/index.sass';
import {Auth} from 'aws-amplify';
import { AppContext } from './utils/contextLib';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './components/header/Header';
import {Generic} from 'rbx';
import Main from './views/Main';


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

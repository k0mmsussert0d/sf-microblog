import React, {ReactElement, useEffect, useState} from 'react';
import './App.scss';
import 'rbx/index.sass';
import {Auth} from 'aws-amplify';
import { AppContext } from './utils/contextLib';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './components/header/Header';
import {Generic, Modal} from 'rbx';
import Main from './views/Main';
import SignUp from './views/SignUp';
import Login from './views/Login';
import PostView from './views/PostView';
import AddPost from './views/AddPost';
import { UserSummary } from './models/API';
import Profile from './views/Profile';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import {ModalContext, ModalElement} from './utils/ModalContext';
import {Helmet} from 'react-helmet';


const App: React.FC = (): ReactElement => {

  const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserSummary | undefined>(undefined);
  const [, setIsAuthenticating] = useState<boolean>(false);

  const [modal, setModal] = useState<ModalElement | undefined>(undefined);

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
      } finally {
        setIsAuthenticating(false);
      }
    };

    onLoad();
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      userHasAuthenticated: userHasAuthenticated,
      authenticatedUserDetails: authenticatedUser
    }}>
      <ModalContext.Provider value={{
        isShowing: modal !== undefined,
        setAsModal: setModal,
        clear: () => setModal(undefined)
      }}>
        <Router>
          <Helmet>
            <meta charSet='utf-8' />
            <meta name='description' content='Community-driven platform for sharing pics and content' />
            <title>Microblog</title>
          </Helmet>
          <Header />
          <Generic as='div' className='main-wrapper'>
            <Modal
              active={modal !== undefined}
            >
              {modal}
            </Modal>
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
      </ModalContext.Provider>
    </AppContext.Provider>
  );
};

export default App;

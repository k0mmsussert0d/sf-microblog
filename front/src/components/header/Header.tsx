import {Navbar, Button, Icon} from 'rbx';
import React, {ReactElement} from 'react';
import './Header.scss';
import {Link, Redirect} from 'react-router-dom';
import {useAppContext} from '../../utils/contextLib';
import {Auth} from 'aws-amplify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';


const Header: React.FC = (): ReactElement => {

  const {isAuthenticated, userHasAuthenticated} = useAppContext();

  const performLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
    return <Redirect to='/' />;
  };

  const signedOutOptions = () => {
    return (
      <Navbar.Menu>
        <Navbar.Segment align="end">
          <Navbar.Item as='div'>
            <Button.Group>
              <Link to='/signup'>
                <Button color="primary">
                  <strong>Sign up</strong>
                </Button>
              </Link>
              <Link to='/login'>
                <Button color="light">Log in</Button>
              </Link>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    );
  };

  const signedInOptions = () => {
    return (
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item>
            <Button.Group>
              <Button color='light' as={Link} to='/add'>
                <Icon size='small'>
                  <FontAwesomeIcon icon={faPlus} />
                </Icon>
                <span>Add new post</span>
              </Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
        <Navbar.Segment align="end">
          <Navbar.Item>
            <Button.Group>
              <Button color='light' as={Link} to='/profile'>
                <Icon>
                  <FontAwesomeIcon icon={faUser} />
                </Icon>
                <span>Profile</span>
              </Button>
              <Button color="primary" onClick={performLogout}>
                <Icon>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </Icon>
                <strong>Log out</strong>
              </Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    );
  };

  return (
    <Navbar>
      <Navbar.Brand>
        <Link to='/'>
          <Navbar.Item as='div'>
            <img
              src="https://bulma.io/images/bulma-logo.png"
              alt=""
              role="presentation"
              width="112"
              height="28"
            />
          </Navbar.Item>
        </Link>
        <Navbar.Burger />
      </Navbar.Brand>
      {isAuthenticated ? signedInOptions() : signedOutOptions()}
    </Navbar>
  );
};

export default Header;

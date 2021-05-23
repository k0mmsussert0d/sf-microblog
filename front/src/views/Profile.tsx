import React, {ReactElement, ReactNode, useEffect, useState} from 'react';
import {useAppContext} from '../utils/contextLib';
import {RouteComponentProps} from 'react-router-dom';
import {UserDetails} from '../models/API';
import {Message} from '../models/UI';
import API from '../utils/API';
import {Box, Content} from 'rbx';
import UserProfileCard from '../components/profile/UserProfileCard';
import ErrorMessage from '../components/shared/ErrorMessage';
import UserActivity from '../components/profile/UserActivity';

const Profile: React.FC<RouteComponentProps<ProfileProps>> = ({match}: RouteComponentProps<ProfileProps>): ReactElement => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<UserDetails | undefined>(undefined);
  const {isAuthenticated, authenticatedUserDetails} = useAppContext();

  useEffect(() => {
    setIsLoading(true);
    if (!(match.params.username)) {
      if (authenticatedUserDetails) {
        API.User.get(authenticatedUserDetails.username)
          .then(details => {
            setUserProfile(details);
          })
          .catch(reason => {
            setErrorMsg({
              type: 'error',
              text: 'Failed to fetch user profile'
            });
            console.error(reason);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      API.User.get(match.params.username)
        .then(details => {
          setUserProfile(details);
        })
        .catch(() => {
          setErrorMsg({
            type: 'error',
            text: 'Failed to fetch user profile'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, authenticatedUserDetails]);

  const renderSpinner = (): ReactNode => {
    return (
      <Content>
        <p>Loading</p>
      </Content>
    );
  };

  const render = (): ReactNode => {
    if (isLoading) {
      return renderSpinner();
    } else {
      return (
        <>
          {errorMsg && <ErrorMessage msg={errorMsg} />}
          {userProfile &&
          <>
            <UserProfileCard user={userProfile.summary} editable={false} />
            <UserActivity posts={userProfile.posts} comments={userProfile.comments} />
          </>
          }
        </>
      );
    }
  };

  return (
    <Box>
      {render()}
    </Box>
  );
};

export interface ProfileProps {
  username?: string
}

export default Profile;

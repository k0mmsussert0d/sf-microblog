import React, {ReactElement} from 'react';
import {UserSummary} from '../../models/API';
import {Box, Level, Content} from 'rbx';
import {getRelativeTimestamp} from '../../utils/viewLib';
import Avatar from './Avatar';
import Config from '../../config';

const UserProfileCard: React.FC<UserProfileCardProps> = ({user, editable}: UserProfileCardProps): ReactElement => {

  const date = new Date(user.joined);

  return (
    <Box>
      <Level>
        <Level.Item align='left'>
          <Avatar
            username={user.username}
            editable={editable}
            defaultImage={`${Config.apiGateway.URL}/avatar${user.avatar}` ?? undefined}
          />
        </Level.Item>
        <Level.Item align='right'>
          <Content>
            <h1>{user.username}</h1>
            <Level.Item tooltip={date.toLocaleString()}>
              <p>Joined {getRelativeTimestamp(date)} ago</p>
            </Level.Item>
          </Content>
        </Level.Item>
      </Level>
    </Box>
  );
};

export interface UserProfileCardProps {
  user: UserSummary
  editable: boolean
}

export default UserProfileCard;

import {BasicPost, Comment} from '../../models/API';
import React, {ReactElement} from 'react';
import Tabs from './Tabs';
import PostComp from '../post/PostPreview';
import CommentComp from '../comment/CommentComp';

export interface UserActivityProps {
  posts: Array<BasicPost>
  comments: Array<Comment>
}

const UserActivity: React.FC<UserActivityProps> = ({posts, comments}: UserActivityProps): ReactElement => {

  return (
    <Tabs>
      <Tabs.Tab name='Posts'>
        {posts.map(post => <PostComp
          key={post.id}
          post={post}
        />)}
      </Tabs.Tab>
      <Tabs.Tab name='Comments'>
        {comments.map(comment => <CommentComp
          key={comment.id}
          comment={comment}
          editable={false}
        />)}
      </Tabs.Tab>
    </Tabs>
  );
};

export default UserActivity;

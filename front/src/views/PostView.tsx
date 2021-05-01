import React, {ReactElement, ReactNode, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Post} from '../models/API';
import { Message } from '../models/UI';
import API from '../utils/API';
import {Container, Message as MessageBox} from 'rbx';
import PostOpened from '../components/post/PostOpened';

const PostView: React.FC<RouteComponentProps<PostViewProps>> = ({match}: RouteComponentProps<PostViewProps>): ReactElement => {

  const [postDetails, setPostDetails] = useState<Post | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  
  useEffect(() => {
    API.Post.get(parseInt(match.params.id))
      .then(response => {
        setPostDetails(response);
      })
      .catch(() => {
        setErrorMsg({
          type: 'error',
          text: 'Failed to load the post. Check the address and try again.'
        });
      });
  }, []);

  const renderErrorMessage = (): ReactNode => {
    return (
      <Container breakpoint='desktop'>
        <MessageBox color='danger'>
          <MessageBox.Header>
            <p>Error</p>
          </MessageBox.Header>
          <MessageBox.Body>
            {errorMsg?.text}
          </MessageBox.Body>
        </MessageBox>
      </Container>
    );
  };

  const renderPost = (): ReactNode => {
    return (
      <>
        {postDetails && <PostOpened post={postDetails}/>}
      </>
    );
  };

  return (
    <>
      {errorMsg && renderErrorMessage()}
      {postDetails && renderPost()}
    </>
  );
};

export interface PostViewProps {
  id: string
}

export default PostView;

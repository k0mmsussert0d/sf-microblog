import React, {ReactElement, ReactNode, useEffect, useState} from 'react';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {Post} from '../models/API';
import { Message } from '../models/UI';
import API from '../utils/API';
import {Container, Message as MessageBox} from 'rbx';
import PostOpened from '../components/post/PostOpened';
import {useAppContext} from '../utils/contextLib';
import AddCommentForm from '../components/post/AddCommentForm';
import EditPostModal from '../components/post/EditPostModal';
import useToggle from '../utils/Toggle';
import DeletePostModal from '../components/post/DeletePostModal';

const PostView: React.FC<RouteComponentProps<PostViewProps>> = ({match}: RouteComponentProps<PostViewProps>): ReactElement => {

  const [postDetails, setPostDetails] = useState<Post | undefined>(undefined);
  const [displayEditModal, toggleEditModal] = useToggle();
  const [displayDeleteModal, toggleDeleteModal] = useToggle();
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);

  const {isAuthenticated, authenticatedUserDetails} = useAppContext();

  useEffect(() => {
    reloadPost();
  }, []);

  const reloadPost = (): void => {
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
  };

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
        {postDetails && <PostOpened
          post={postDetails}
          editable={authenticatedUserDetails?.username === postDetails?.author.username}
          toggleEdit={toggleEditModal}
          toggleDelete={toggleDeleteModal}
        />}
      </>
    );
  };

  const renderEditPostModal = (): ReactNode => {
    return (
      <>
        {postDetails && <EditPostModal
          post={postDetails}
          toggle={toggleEditModal}
          reloadPost={reloadPost}
        />}
      </>
    );
  };
  
  const renderDeletePostModal = (): ReactNode => {
    return (
      <>
        {postDetails && <DeletePostModal
          post={postDetails}
          toggle={toggleDeleteModal}
          redirect={() => setRedirectTo('/')}
        />}
      </>
    );
  };

  const commentSubmittedCbk = (): void => {
    reloadPost();
  };

  return (
    <>
      {redirectTo && <Redirect to={redirectTo} />}
      {errorMsg && renderErrorMessage()}
      {postDetails && renderPost()}
      {displayEditModal && renderEditPostModal()}
      {displayDeleteModal && renderDeletePostModal()}
      {postDetails && isAuthenticated &&
        <AddCommentForm 
          postId={postDetails.id}
          addCommentSuccessCallback={commentSubmittedCbk}
        />
      }
    </>
  );
};

export interface PostViewProps {
  id: string
}

export default PostView;

import React, {ReactElement, ReactNode, useEffect, useState} from 'react';
import {Comment} from '../../models/API';
import DisplayComment from './DisplayComment';
import useToggle from '../../utils/Toggle';
import EditCommentModal from './EditCommentModal';
import {Message as MessageBox} from 'rbx/components/message/message';
import {Container} from 'rbx';
import DeleteCommentModal from './DeleteCommentModal';
import {useModalContext} from '../../utils/ModalContext';

const CommentComp: React.FC<CommentCompProps> = ({comment, editable, parentPostId}: CommentCompProps): ReactElement => {

  const [commentState, setCommentState] = useState<Comment | undefined>(comment);

  const [displayEditModal, toggleEditModal] = useToggle();
  const [displayDeleteModal, toggleDeleteModal] = useToggle();

  const {setAsModal, clear} = useModalContext();

  useEffect(() => {
    if (commentState && parentPostId && displayEditModal) {
      setAsModal(
        <EditCommentModal
          comment={commentState}
          setComment={setCommentState}
          toggle={toggleEditModal}
          parentPostId={parentPostId}
        />
      );
    } else {
      clear();
    }
  }, [displayEditModal]);

  useEffect(() => {
    if (commentState && displayDeleteModal) {
      setAsModal(
        <DeleteCommentModal
          comment={commentState}
          hide={toggleDeleteModal}
          onSuccess={() => {
            setCommentState(undefined);
            clear();
          }}
        />
      );
    } else {
      clear();
    }
  }, [displayDeleteModal]);
  
  const displayComment = (): ReactNode => {
    if (commentState) {
      return (
        <>
          <DisplayComment
            comment={commentState}
            editable={editable}
            toggleEdit={toggleEditModal}
            toggleDelete={toggleDeleteModal}
          />
        </>
      );
    }
  };

  const displayDeleted = (): ReactNode => {
    return (
      <Container breakpoint='desktop'>
        <MessageBox color='info'>
          <MessageBox.Body>Comment deleted</MessageBox.Body>
        </MessageBox>
      </Container>
    );
  };

  return (
    <>
      {commentState ? displayComment() : displayDeleted()}
    </>
  );
};

export interface CommentCompProps {
  comment: Comment
  editable: boolean
  parentPostId?: number
}

export default CommentComp;

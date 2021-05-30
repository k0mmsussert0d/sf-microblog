import React, {ReactElement, useState} from 'react';
import {Comment} from '../../models/API';
import DisplayComment from './DisplayComment';
import useToggle from '../../utils/Toggle';
import EditCommentModal from './EditCommentModal';

const CommentComp: React.FC<CommentCompProps> = ({comment, editable, parentPostId}: CommentCompProps): ReactElement => {

  const [commentState, setCommentState] = useState<Comment>(comment);

  const [displayEditModal, toggleEditModal] = useToggle();
  const [displayDeleteModal, toggleDeleteModal] = useToggle();

  return (
    <>
      <DisplayComment
        comment={commentState}
        editable={editable}
        toggleEdit={toggleEditModal}
        toggleDelete={toggleDeleteModal}
      />
      {editable && parentPostId && displayEditModal &&
      <EditCommentModal
        comment={commentState}
        setComment={setCommentState}
        toggle={toggleEditModal}
        parentPostId={parentPostId}
      />
      }
    </>
  );
};

export interface CommentCompProps {
  comment: Comment
  editable: boolean
  parentPostId?: number
}

export default CommentComp;

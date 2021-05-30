import React, {useState} from 'react';
import {Comment} from '../../models/API';
import {Button, Delete, Generic, Level, Modal} from 'rbx';
import {ModalElement, ModalElementType} from '../../utils/ModalContext';
import styles from '../post/EditPostModal.module.scss';
import {Message} from '../../models/UI';
import API from '../../utils/API';

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({hide, comment, onSuccess}: DeleteCommentModalProps): ModalElement => {

  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteComment = (): void => {
    setIsDeleting(true);
    API.Comment.remove(comment.id)
      .then(() => {
        onSuccess?.();
      })
      .catch(() => {
        setErrorMsg({
          type: 'error',
          text: 'Failed to delete the comment'
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Modal.Background onClick={hide} />
      <Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>Delete comment</Modal.Card.Title>
          <Delete onClick={hide} />
        </Modal.Card.Head>
        <Modal.Card.Body>
          Do you really want to irreversibly delete this comment?
        </Modal.Card.Body>
        <Modal.Card.Foot>
          <Level className={styles.footer}>
            <Level.Item align='left'>
              {isDeleting ?
                <Button state='loading' color='danger'>Deleting...</Button> :
                <Button color='danger' onClick={deleteComment}>Delete</Button>
              }
              <Button onClick={hide}>Cancel</Button>
            </Level.Item>
            <Level.Item align='right'>
              <Generic>{errorMsg?.text}</Generic>
            </Level.Item>
          </Level>
        </Modal.Card.Foot>
      </Modal.Card>
    </>
  );
};

export interface DeleteCommentModalProps extends ModalElementType {
  comment: Comment,
  onSuccess?: () => void,
}

export default DeleteCommentModal;

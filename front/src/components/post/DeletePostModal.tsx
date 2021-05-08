import React, {ReactElement, useState} from 'react';
import {Post} from '../../models/API';
import {Delete, Modal, Level, Button, Generic} from 'rbx';
import API from '../../utils/API';
import {Message} from '../../models/UI';
import styles from './EditPostModal.module.scss';

const DeletePostModal: React.FC<DeletePostModalProps> = ({post, toggle, redirect}: DeletePostModalProps): ReactElement => {

  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = (): void => {
    setIsDeleting(true);
    API.Post.remove(post.id)
      .then(() => {
        redirect();
      })
      .catch(() => {
        setErrorMsg({
          type: 'error',
          text: 'Failed to delete the post'
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <Modal active>
      <Modal.Background onClick={toggle} />
      <Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>Delete post</Modal.Card.Title>
          <Delete onClick={toggle} />
        </Modal.Card.Head>
        <Modal.Card.Body>
          Do you really want to irreversibly delete this post?
        </Modal.Card.Body>
        <Modal.Card.Foot>
          <Level className={styles.footer}>
            <Level.Item align='left'>
              {isDeleting ?
                <Button state='loading' color='danger'>Deleting...</Button> :
                <Button color='danger' onClick={deletePost}>Delete</Button>
              }
              <Button onClick={toggle}>Cancel</Button>
            </Level.Item>
            <Level.Item align='right'>
              <Generic>{errorMsg?.text}</Generic>
            </Level.Item>
          </Level>
        </Modal.Card.Foot>
      </Modal.Card>
    </Modal>
  );
};

export interface DeletePostModalProps {
  post: Post
  toggle: () => void
  redirect: () => void
}

export default DeletePostModal;

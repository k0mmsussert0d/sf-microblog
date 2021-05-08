import React, {ReactElement, useState} from 'react';
import {Comment, NewComment} from '../../models/API';
import {Delete, Modal, Field, Label, Control, Level, Button, Generic} from 'rbx';
import {useForm} from 'react-hook-form';
import styles from '../post/EditPostModal.module.scss';
import API from '../../utils/API';
import {Message} from '../../models/UI';
import ControlledTextarea from '../shared/ControlledTextarea';

interface EditCommentModalForms {
  textContent: string
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({comment, setComment, toggle, parentPostId}: EditCommentModalProps): ReactElement => {

  const {handleSubmit, formState: {errors}, control} = useForm<EditCommentModalForms>();
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);

  const editComment = (form: EditCommentModalForms): void => {
    setIsEditing(true);

    const newComment: NewComment = {
      textContent: form.textContent,
      postId: parentPostId
    };

    API.Comment.update(newComment, comment.id)
      .then(updatedComment => {
        setComment(updatedComment);
        toggle();
      })
      .catch(() => {
        setErrorMsg({
          type: 'error',
          text: 'Failed to edit the comment'
        });
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <Modal active>
      <Modal.Background onClick={toggle} />
      <form onSubmit={handleSubmit(editComment)}>
        <Modal.Card>
          <Modal.Card.Head>
            <Modal.Card.Title>Edit comment</Modal.Card.Title>
            <Delete onClick={toggle} />
          </Modal.Card.Head>
          <Modal.Card.Body>
            <Field horizontal>
              <Field.Label size='normal'>
                <Label>Comment</Label>
              </Field.Label>
              <Field.Body>
                <Field>
                  <Control expanded>
                    <ControlledTextarea
                      control={control}
                      name='textContent'
                      defaultValue={comment.content}
                      rules={{
                        required: {
                          value: true,
                          message: 'Comment cannot be empty'
                        }
                      }}
                      error={errors.textContent}
                    />
                  </Control>
                </Field>
              </Field.Body>
            </Field>
          </Modal.Card.Body>
          <Modal.Card.Foot>
            <Level className={styles.footer}>
              <Level.Item align='left'>
                {isEditing ?
                  <Button state="loading" color="success">Sending...</Button> :
                  <Button type="submit" color="success">Edit comment</Button>
                }
                <Button onClick={toggle}>Cancel</Button>
              </Level.Item>
              <Level.Item align='right'>
                <Generic>{errorMsg?.text}</Generic>
              </Level.Item>
            </Level>
          </Modal.Card.Foot>
        </Modal.Card>
      </form>
    </Modal>
  );
};

export interface EditCommentModalProps {
  comment: Comment
  setComment: (c: Comment) => void
  toggle: () => void
  parentPostId: number
}

export default EditCommentModal;

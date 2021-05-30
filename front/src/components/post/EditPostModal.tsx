import React, {ReactElement, useState} from 'react';
import styles from './EditPostModal.module.scss';
import {Button, Delete, Modal, Field, Label, Control, Level, Generic} from 'rbx';
import {Post, NewPost} from '../../models/API';
import ControlledInput from '../shared/ControlledInput';
import ControlledTextarea from '../shared/ControlledTextarea';
import {useForm} from 'react-hook-form';
import API from '../../utils/API';
import {Message} from '../../models/UI';


interface EditPostModalForms {
  title: string,
  textContent: string
}

const EditPostModal: React.FC<EditPostModalProps> = ({post, toggle, reloadPost}: EditPostModalProps): ReactElement => {

  const {handleSubmit, control, formState: {errors}} = useForm<EditPostModalForms>();
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const editPost = (form: EditPostModalForms): void => {
    setIsEditing(true);

    const postDetails: NewPost = form;

    API.Post.update(post.id, postDetails)
      .then(() => {
        reloadPost();
        toggle();
      })
      .catch(() => {
        setErrorMsg({
          type: 'error',
          text: 'Failed to update the post'
        });
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <Modal active>
      <Modal.Background onClick={toggle} />
      <form onSubmit={handleSubmit(editPost)}>
        <Modal.Card>
          <Modal.Card.Head>
            <Modal.Card.Title>Edit post</Modal.Card.Title>
            <Delete onClick={toggle} />
          </Modal.Card.Head>
          <Modal.Card.Body>
            <Field horizontal>
              <Field.Label size='normal'>
                <Label>Post title</Label>
              </Field.Label>
              <Field.Body>
                <Field>
                  <Control expanded>
                    <ControlledInput
                      control={control}
                      name='title'
                      rules={{
                        required: {
                          value: true,
                          message: 'Post title cannot be empty'
                        },
                        minLength: {
                          value: 3,
                          message: 'Post title needs to be longer than 3 characters'
                        }
                      }}
                      defaultValue={post.title}
                      error={errors.title}
                    />
                  </Control>
                </Field>
              </Field.Body>
            </Field>
            <Field horizontal>
              <Field.Label size='normal'>
                <Label>Text content</Label>
              </Field.Label>
              <Field.Body>
                <Field>
                  <Control expanded>
                    <ControlledTextarea
                      control={control}
                      name='textContent'
                      rules={{
                        required: {
                          value: true,
                          message: 'Post title cannot be empty'
                        }
                      }}
                      defaultValue={post.textContent}
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

export interface EditPostModalProps {
  post: Post
  toggle: () => void
  reloadPost: () => void
}

export default EditPostModal;

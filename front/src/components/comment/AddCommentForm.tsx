import React, {ReactElement, useState} from 'react';
import {Button, Control, Field, Image, Media} from 'rbx';
import ControlledTextarea from '../shared/ControlledTextarea';
import {Comment, NewComment} from '../../models/API';
import {Message} from '../../models/UI';
import {useForm} from 'react-hook-form';
import API from '../../utils/API';

interface AddCommentFormForms {
  textContent: string
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props: AddCommentFormProps): ReactElement => {

  const [isSending, setIsSending] = useState(false);
  const {handleSubmit, control, formState: {errors}, setValue} = useForm<AddCommentFormForms>();

  const submitNewComment = async (form: AddCommentFormForms): Promise<void> => {
    setIsSending(true);
    await API.Comment.add({
      postId: props.postId,
      textContent: form.textContent
    })
      .then(addedComment => {
        setValue('textContent', '');
        props.addCommentSuccessCallback?.(addedComment, form);
      })
      .catch(() => {
        props.addCommentFailureCallback?.({
          type: 'error',
          text: 'Failed to add new comment'
        }, form);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <Media as="article">
      <Media.Item align="left">
        <Image.Container as="p" size={64}>
          <Image src="https://bulma.io/images/placeholders/128x128.png" />
        </Image.Container>
      </Media.Item>
      <Media.Item align="content">
        <form onSubmit={handleSubmit(submitNewComment)}>
          <Field>
            <Control as="p">
              <ControlledTextarea
                control={control}
                name='textContent'
                rules={{
                  required: {
                    value: true,
                    message: 'Please enter the comment'
                  }
                }}
                placeholder='Add new comment...'
                error={errors.textContent}
              />
            </Control>
          </Field>
          <Field>
            <Control as="p">
              {isSending ?
                <Button state="loading" color="success">Sending...</Button> :
                <Button type="submit" color="success">Add comment</Button>
              }
            </Control>
          </Field>
        </form>
      </Media.Item>
    </Media>
  );
};

export interface AddCommentFormProps {
  postId: number
  addCommentSuccessCallback?: (comment: Comment, newComment?: NewComment) => (void | undefined),
  addCommentFailureCallback?: (msg: Message, newComment?: NewComment) => (void | undefined)
}

export default AddCommentForm;

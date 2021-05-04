import {Control, Field, Label, Button, Icon, Message as RbxMessage, Delete} from 'rbx';
import React, {ReactElement, useState} from 'react';
import {ControlledInput} from '../shared/ControlledInput';
import ControlledTextarea from '../shared/ControlledTextarea';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane, faTrash} from '@fortawesome/free-solid-svg-icons';
import {useForm, FormProvider} from 'react-hook-form';
import ControlledFile from '../shared/ControlledFile';
import API from '../../utils/API';
import {NewPost, Post} from '../../models/API';
import {Redirect} from 'react-router-dom';
import {Message} from '../../models/UI';

interface AddPostFormForms {
  postTitle: string
  mediaContent: FileList
  textContent?: string
}

const AddPostForm: React.FC = (): ReactElement => {

  const methods = useForm<AddPostFormForms>();
  const {handleSubmit, control, getValues, formState: {errors}} = methods;

  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Message | undefined>(undefined);
  const [addedPostId, setAddedPostId] = useState<number | undefined>(undefined);

  const addPost = async (form: AddPostFormForms): Promise<void> => {
    setIsAdding(true);

    const postDetails: NewPost = {
      title: form.postTitle,
      textContent: form.textContent ?? ''
    };

    let apiCall: (post: any) => Promise<Post>;
    let args;

    if (form.mediaContent.length > 0) {
      apiCall = API.Post.postWithMedia;
      args = {
        postDetails: postDetails,
        mediaData: form.mediaContent[0]
      };
    } else {
      apiCall = API.Post.post;
      args = postDetails;
    }

    apiCall(args).then(addedPost => {
      setAddedPostId(addedPost.id);
    }).catch(reason => {
      displayErrorMsg({
        type: 'error',
        text: 'Failed to add the post'
      });
      console.error(reason);
    }).finally(() => {
      setIsAdding(false);
    });
  };

  const displayErrorMsg = (error: Message): void => {
    setErrorMsg(error);
    setTimeout(() => setErrorMsg(undefined), 5000);
  };

  if (addedPostId) return <Redirect to={`/${addedPostId}`} />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(addPost)}>
        {errorMsg && <Field horizontal>
          <Field.Label>
          </Field.Label>
          <Field.Body>
            <Field>
              <RbxMessage color='danger'>
                <RbxMessage.Header>
                  <p>Error</p>
                  <Delete as='button'/>
                </RbxMessage.Header>
                <RbxMessage.Body>
                  {errorMsg?.text}
                </RbxMessage.Body>
              </RbxMessage>
            </Field>
          </Field.Body>
        </Field>}
        <Field horizontal>
          <Field.Label size='normal'>
            <Label>Post title</Label>
          </Field.Label>
          <Field.Body>
            <Field>
              <Control expanded>
                <ControlledInput
                  control={control}
                  name='postTitle'
                  rules={{
                    required: {
                      value: true,
                      message: 'Post title is required'
                    },
                    minLength: {
                      value: 3,
                      message: 'Post title needs to be longer than 3 characters'
                    }
                  }}
                  error={errors.postTitle}
                />
              </Control>
            </Field>
          </Field.Body>
        </Field>
        <Field horizontal>
          <Field.Label>
            <Label>Text content</Label>
          </Field.Label>
          <Field.Body>
            <Field>
              <Control>
                <ControlledTextarea
                  control={control}
                  name='textContent'
                  rules={{
                    validate: {
                      notEmptyIfNoMediaContent: () => {
                        const {textContent, mediaContent} = getValues();
                        if (!textContent && (!mediaContent || mediaContent.length <= 0)) {
                          return 'Either text or file must be attached to the post';
                        }

                        return true;
                      }
                    }
                  }}
                  error={errors.textContent}
                />
              </Control>
            </Field>
          </Field.Body>
        </Field>
        <Field horizontal>
          <Field.Label>
            <Label>
            Picture
            </Label>
          </Field.Label>
          <Field.Body>
            <ControlledFile
              control={control}
              fileProps={{
                align: 'centered',
                fullwidth: true,
                boxed: true,
                hasName: true
              }}
              name='mediaContent'
              rules={{
                validate: {
                  notEmptyIfNoTextContent: () => {
                    const {textContent, mediaContent} = getValues();
                    if (!textContent && (!mediaContent || mediaContent.length <= 0)) {
                      return 'Either text or file must be attached to the post';
                    }

                    return true;
                  }
                }
              }}
            />
          </Field.Body>
        </Field>
        <Field horizontal>
          <Field.Label /> {/* Left empty for spacing  */}
          <Field.Body>
            <Field>
              <Control>
                <Button.Group>
                  <Button color='danger' type='clear'>
                    <Icon size='small'>
                      <FontAwesomeIcon icon={faTrash} />
                    </Icon>
                    <span>Clear</span>
                  </Button>
                  {isAdding ?
                    <Button color='success' state='loading'>
                      <Icon size='small'>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </Icon>
                      <span>Sending...</span>
                    </Button> :
                    <Button color='success' type='submit'>
                      <Icon size='small'>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </Icon>
                      <span>Send</span>
                    </Button>}
                </Button.Group>
              </Control>
            </Field>
          </Field.Body>
        </Field>
      </form>
    </FormProvider>
  );
};

export default AddPostForm;

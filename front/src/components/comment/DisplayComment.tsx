import React, {ReactElement} from 'react';
import {Comment} from '../../models/API';
import {Button, Content, Dropdown, Icon, Image, Level, Media} from 'rbx';
import styles from './CommentComp.module.scss';
import {Link} from 'react-router-dom';
import {formatTextContent, getRelativeTimestamp} from '../../utils/viewLib';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faEllipsisV, faTrash} from '@fortawesome/free-solid-svg-icons';

const DisplayComment: React.FC<DisplayCommentProps> = ({comment, editable, toggleEdit, toggleDelete}: DisplayCommentProps): ReactElement => {

  const commentDate = new Date(comment.date);

  return (
    <Media>
      <Media.Item as='figure' align='left'>
        <Image.Container as="p" size={48}>
          <Image src="https://bulma.io/images/placeholders/128x128.png" />
        </Image.Container>
      </Media.Item>
      <Media.Item align='content'>
        <Level as='nav' className={styles.commentHeader}>
          <Level.Item align='left'>
            <Level.Item className={styles.commentAuthor} as={Link} to={`/user/${comment.author.username}`}>
              {comment.author.username}
            </Level.Item>
            <Level.Item tooltip={commentDate.toLocaleString()}>
              {getRelativeTimestamp(commentDate) + ' ago'}
            </Level.Item>
          </Level.Item>
          {editable &&
          <Level.Item align='right'>
            <Level.Item>
              <Dropdown align='right'>
                <Dropdown.Trigger>
                  <Button inverted color='black'>
                    <Icon size='small'>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </Icon>
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  <Dropdown.Content>
                    <Dropdown.Item onClick={toggleEdit}>
                      <Level>
                        <Level.Item align='left'>
                          <Icon size='small'>
                            <FontAwesomeIcon icon={faEdit}/>
                          </Icon>
                        </Level.Item>
                        <Level.Item>
                          Edit
                        </Level.Item>
                      </Level>
                    </Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={toggleDelete}>
                      <Level>
                        <Level.Item align='left'>
                          <Icon size='small'>
                            <FontAwesomeIcon icon={faTrash}/>
                          </Icon>
                        </Level.Item>
                        <Level.Item>
                          Delete
                        </Level.Item>
                      </Level>
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Menu>
              </Dropdown>
            </Level.Item>
          </Level.Item>
          }
        </Level>
        <Content dangerouslySetInnerHTML={{__html: formatTextContent(comment.content)}} />
      </Media.Item>
    </Media>
  );
};

export interface DisplayCommentProps {
  comment: Comment
  editable: boolean
  toggleEdit: () => void
  toggleDelete: () => void
}

export default DisplayComment;

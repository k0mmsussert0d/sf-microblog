import React, {ReactElement} from 'react';
import styles from './CommentComp.module.scss';
import {Media, Image, Content, Level} from 'rbx';
import {Comment} from '../../models/API';
import {formatTextContent, getRelativeTimestamp} from '../../utils/viewLib';
import {Link} from 'react-router-dom';

const CommentComp: React.FC<CommentCompProps> = ({comment}: CommentCompProps): ReactElement => {

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
        </Level>
        <Content dangerouslySetInnerHTML={{__html: formatTextContent(comment.content)}} />
      </Media.Item>
    </Media>
  );
};

export interface CommentCompProps {
  comment: Comment
}

export default CommentComp;

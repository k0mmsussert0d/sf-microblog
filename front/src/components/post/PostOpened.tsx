import {Post} from '../../models/API';
import React, {ReactElement} from 'react';
import styles from './PostOpened.module.scss';
import {Content, Generic, Image, Level, Media, Title} from 'rbx';
import {Link} from 'react-router-dom';
import {formatTextContent, getRelativeTimestamp} from '../../utils/viewLib';
import CommentComp from './CommentComp';
import Config from '../../config';

const PostOpened: React.FC<PostOpenedProps> = ({post}: PostOpenedProps): ReactElement => {
  
  const postDate = new Date(post.date);

  return (
    <Media key={post.id} as='article'>
      <Media.Item as="figure" align="left">
        <Image.Container as="p" size={64}>
          <Image
            alt="64x64"
            src="https://bulma.io/images/placeholders/128x128.png"
          />
        </Image.Container>
      </Media.Item>
      <Media.Item align="content">
        <Level as='nav' className={styles.postHeader}>
          <Level.Item align='left'>
            <Level.Item className={styles.postAuthor} as={Link} to={`/user/${post.author.username}`}>
              {post.author.username}
            </Level.Item>
            <Level.Item className={styles.postDate} tooltip={postDate.toLocaleString()}>
              {getRelativeTimestamp(postDate) + ' ago'}
            </Level.Item>
          </Level.Item>
        </Level>
        <Generic as='div' className={styles.postContent}>
          <Title size={2} as='h2' className={styles.postTitle}>{post.title}</Title>
          {post.imageId && <Image.Container>
            <Image
              alt={`${post.title} attached image`}
              src={`${Config.apiGateway.URL}/img/${post.imageId}`}
            />
          </Image.Container>}
          <Content>
            <p className={styles.postTextContent} dangerouslySetInnerHTML={{__html: formatTextContent(post.textContent)}} />
          </Content>
        </Generic>
        {post.comments && post.comments.map((comment) => (
          <CommentComp comment={comment} key={comment.id} />
        ))}
      </Media.Item>
    </Media>
  );
};

export interface PostOpenedProps {
  post: Post
}

export default PostOpened;

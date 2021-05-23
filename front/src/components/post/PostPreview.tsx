import React, {ReactElement} from 'react';
import styles from './PostPreview.module.scss';
import {Content, Generic, Icon, Image, Level, Media, Title} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {BasicPost} from '../../models/API';
import {Link} from 'react-router-dom';
import {formatTextContent, getRelativeTimestamp} from '../../utils/viewLib';
import Config from '../../config';

const PostComp: React.FC<PostCompProps> = ({post}: PostCompProps): ReactElement => {

  const postDate = new Date(post.date);

  return (
    <Media key={post.id}>
      <Media.Item as="figure" align="left">
        <Image.Container as="p" size={64}>
          <Image
            alt="64x64"
            src="https://bulma.io/images/placeholders/128x128.png"
          />
        </Image.Container>
      </Media.Item>
      <Media.Item align="content" className={styles.mediaContent}>
        <Level as='nav' className={styles.postHeader}>
          <Level.Item align='left'>
            <Level.Item className={styles.postAuthor} as={Link} to={`/profile/${post.author.username}`}>
              {post.author.username}
            </Level.Item>
            <Level.Item className={styles.postDate} tooltip={postDate.toLocaleString()}>
              {getRelativeTimestamp(postDate) + ' ago'}
            </Level.Item>
          </Level.Item>
        </Level>
        <Generic className={styles.postContent} as={Link} to={`/${post.id}`}>
          <Title size={2} as='h2' className={styles.postTitle}>{post.title}</Title>
          {post.imageUrl && <Image.Container>
            <Image
              alt={`${post.title} attached image`}
              src={`${Config.apiGateway.URL}/img/${post.imageUrl}`}
            />
          </Image.Container>}
          <Content>
            <p className={styles.postTextContent} dangerouslySetInnerHTML={{__html: formatTextContent(post.textContent)}} />
          </Content>
        </Generic>
        <Level breakpoint="mobile">
          <Level.Item align="left" as={Link} to={`/${post.id}#comment`} className={styles.postCommentsButton}>
            <Level.Item>
              <Icon size="small">
                <FontAwesomeIcon icon={faComment}/>
              </Icon>
              <Generic as='div' className={styles.postCommentsCount}>
                {post.commentsCount}
              </Generic>
            </Level.Item>
          </Level.Item>
        </Level>
      </Media.Item>
    </Media>
  );
};

export interface PostCompProps {
  post: BasicPost
}

export default PostComp;

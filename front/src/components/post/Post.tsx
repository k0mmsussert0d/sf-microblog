import React, {ReactElement} from 'react';
import {Content, Generic, Icon, Image, Level, Media} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {Post} from '../../models/API';
import {Link} from 'react-router-dom';
import './Post.scss';

const PostComp: React.FC<Post> = (post: Post): ReactElement => {

  const postDate = new Date(post.date);

  const getRelativeTimestamp = (datetime: Date): string => {
    const seconds = Math.floor((new Date().getTime() - datetime.getTime())) / 1000;

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

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
      <Media.Item align="content">
        <Level as='nav' className='post-header'>
          <Level.Item align='left'>
            <Level.Item className='post-author' as={Link} to={`/user/${post.author.username}`}>
              {post.author.username}
            </Level.Item>
            <Level.Item className='post-date' tooltip={postDate.toLocaleString()}>
              {getRelativeTimestamp(postDate) + ' ago'}
            </Level.Item>
          </Level.Item>
        </Level>
        <Content className='post-content' as={Link} to={`/${post.id}`}>
          <p>
            <h2 className='post-title'>{post.title}</h2>
            <p className='post-text-content'>{post.textContent}</p>
          </p>
        </Content>
        <Level breakpoint="mobile">
          <Level.Item align="left" as={Link} to={`/${post.id}#comment`} className='post-comments-button'>
            <Level.Item>
              <Icon size="small">
                <FontAwesomeIcon icon={faComment}/>
              </Icon>
              <Generic as='div' className='post-comments-count'>
                {post.comments?.length}
              </Generic>
            </Level.Item>
          </Level.Item>
        </Level>
      </Media.Item>
    </Media>
  );
};

export default PostComp;

import React, {ReactElement} from 'react';
import './Post.scss';
import {Content, Generic, Icon, Image, Level, Media} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {Post} from '../../models/API';
import {Link} from 'react-router-dom';

const PostComp = (post: Post): ReactElement => {

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
      <Link to={`/${post.id}`}>
        <Media.Item align="content">
          <Content>
            <p>
              <strong className='post-author'>{post.author.username}</strong>
              <small className='post-date'>{getRelativeTimestamp(new Date(post.date)) + 'ago'}</small>
              <br/>
              {post.textContent}
            </p>
          </Content>
          <Level breakpoint="mobile">
            <Level.Item align="left">
              <Level.Item>
                <Icon size="small">
                  <FontAwesomeIcon icon={faComment}/>
                </Icon>
                <Generic as='div' className='comments-count'>
                  {post.comments?.length}
                </Generic>
              </Level.Item>
            </Level.Item>
          </Level>
        </Media.Item>
      </Link>
    </Media>
  );
};

export default PostComp;

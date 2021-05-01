import React, {ReactElement, useEffect, useRef, useState} from 'react';
import API from '../utils/API';
import {Post} from '../models/API';
import {Generic, PageLoader} from 'rbx';
import PostComp from '../components/post/Post';

const Main: React.FC = (): ReactElement => {

  const isMounted = useRef(true);

  const [posts, setPosts] = useState<Array<Post>>([]);
  const [isLoadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    setLoadingPosts(true);
    API.Post.getAll()
      .then((res: Array<Post>) => {
        setPosts(res);
      })
      .catch(reason => {
        console.error(reason);
      })
      .finally(() => {
        setLoadingPosts(false);
      });

    return () => {
      isMounted.current = false;
    };
  }, []);

  const renderPageLoader = () => {
    return (
      <>
        <PageLoader active={true} color={'light'}/>
      </>
    );
  };

  const renderPostsList = () => {
    return (
      <>
        {posts.map((post: Post) => PostComp({post: post}))}
      </>
    );
  };

  return (
    <Generic>
      {isLoadingPosts ? renderPageLoader() : renderPostsList()}
    </Generic>
  );
};

export default Main;

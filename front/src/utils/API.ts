import {NewComment, NewPost, NewPostWithMedia, NewUserDetails, Post, UserDetails, UserSummary, Comment} from '../models/API';
import {API as AwsApi} from 'aws-amplify';

const API_NAME = 'api';

const API = {
  Post: {
    getAll: (): Promise<Array<Post>> => {
      return AwsApi.get(
        API_NAME,
        '/post',
        null
      );
    },
    get: (id: number): Promise<Post> => {
      return AwsApi.get(
        API_NAME,
        `/post/${id}`,
        null
      );
    },
    post: (post: NewPost): Promise<Post> => {
      return AwsApi.post(
        API_NAME,
        '/post',
        {
          body: post
        }
      );
    },
    postWithMedia: (post: NewPostWithMedia): Promise<Post> => {
      const fd = new FormData();
      fd.append('postDetails', new Blob([JSON.stringify(post.postDetails)], { type: 'application/json' }));
      fd.append('mediaData', post.mediaData);

      return AwsApi.post(
        API_NAME,
        '/post',
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: fd
        }
      );
    },
    update: (id: number, newPost: NewPost): Promise<Post> => {
      return AwsApi.put(
        API_NAME,
        `/post/${id}`,
        {
          body: newPost
        }
      );
    },
    remove: (id: number): Promise<void> => {
      return AwsApi.del(
        API_NAME,
        `/post/${id}`,
        null
      );
    }
  },
  Comment: {
    add: (newComment: NewComment): Promise<Comment> => {
      return AwsApi.post(
        API_NAME,
        '/comment',
        {
          body: newComment
        }
      );
    },
    update: (newComment: NewComment, commentId: number): Promise<Comment> => {
      return AwsApi.put(
        API_NAME,
        `/comment/${commentId}`,
        {
          body: newComment
        }
      );
    },
    remove: (commentId: number): Promise<void> => {
      return AwsApi.del(
        API_NAME,
        `/comment/${commentId}`,
        null
      );
    }
  },
  User: {
    getAuthenticated: (): Promise<UserSummary> => {
      return AwsApi.get(
        API_NAME,
        '/user',
        null
      );
    },
    updateDetails: (newUserDetails: NewUserDetails): Promise<UserSummary> => {
      return AwsApi.put(
        API_NAME,
        '/user',
        {
          body: newUserDetails
        }
      );
    },
    get: (username: string): Promise<UserDetails> => {
      return AwsApi.get(
        API_NAME,
        `/user/${username}`,
        null
      );
    }
  }
};

export default API;

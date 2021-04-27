/**
 * Basic details of a post
 * @export
 * @interface BasicPost
 */
export interface BasicPost {
  /**
   * Unique identifier of the post, started by 1 and autoincremented with each post and comment added
   * @type {number}
   * @memberof BasicPost
   */
  id: number;
  /**
   *
   * @type {BasicUserDetails}
   * @memberof BasicPost
   */
  author: BasicUserDetails;
  /**
   * Title of the post
   * @type {string}
   * @memberof BasicPost
   */
  title: string;
  /**
   * Text content added in the post
   * @type {string}
   * @memberof BasicPost
   */
  textContent: string;
  /**
   * URL to the image attached to the post
   * @type {string}
   * @memberof BasicPost
   */
  imageUrl?: string;
  /**
   * Quantity of comments added to the post
   * @type {number}
   * @memberof BasicPost
   */
  commentsCount: number;
  /**
   * Date and time when post was added
   * @type {Date}
   * @memberof BasicPost
   */
  date: Date;
}
/**
 * Basic details of the user
 * @export
 * @interface BasicUserDetails
 */
export interface BasicUserDetails {
  /**
   *
   * @type {string}
   * @memberof BasicUserDetails
   */
  username: string;
  /**
   * URL pointing to the avatar used
   * @type {string}
   * @memberof BasicUserDetails
   */
  avatar?: string;
}
/**
 * Full details of a comment
 * @export
 * @interface Comment
 */
export interface Comment {
  /**
   * Unique identifier of the comment, started by 1 and autoincremented with each post and comment added
   * @type {number}
   * @memberof Comment
   */
  id: number;
  /**
   *
   * @type {BasicUserDetails}
   * @memberof Comment
   */
  author: BasicUserDetails;
  /**
   * Content of a comment
   * @type {string}
   * @memberof Comment
   */
  content: string;
  /**
   * Date and time when comment was added
   * @type {Date}
   * @memberof Comment
   */
  date: Date;
}
/**
 * Details of newly added comment. Essentialy comment schema without auto-generated fields.
 * @export
 * @interface NewComment
 */
export interface NewComment {
  /**
   * ID of the post comment is being added to
   * @type {number}
   * @memberof NewComment
   */
  postId?: number;
  /**
   * Content of the comment
   * @type {string}
   * @memberof NewComment
   */
  textContent?: string;
}
/**
 * Details of a new posted to be added. Essentially post schema without auto-generated fields.
 * @export
 * @interface NewPost
 */
export interface NewPost {
  /**
   * Title of a new post
   * @type {string}
   * @memberof NewPost
   */
  title: string;
  /**
   * Text content of a new post
   * @type {string}
   * @memberof NewPost
   */
  textContent: string;
}
/**
 *
 * @export
 * @interface NewPostWithMedia
 */
export interface NewPostWithMedia {
  /**
   *
   * @type {NewPost}
   * @memberof NewPostWithMedia
   */
  postDetails: NewPost;
  /**
   *
   * @type {Blob}
   * @memberof NewPostWithMedia
   */
  mediaData: Blob;
}
/**
 * User details to be updated
 * @export
 * @interface NewUserDetails
 */
export interface NewUserDetails {
  /**
   * URL of a new avatar image
   * @type {string}
   * @memberof NewUserDetails
   */
  avatar?: string;
}
/**
 * Full details of a post
 * @export
 * @interface Post
 */
export interface Post {
  /**
   * Unique identifier of the post, started by 1 and autoincremented with each post and comment added
   * @type {number}
   * @memberof Post
   */
  id: number;
  /**
   *
   * @type {BasicUserDetails}
   * @memberof Post
   */
  author: BasicUserDetails;
  /**
   * Title of the post
   * @type {string}
   * @memberof Post
   */
  title: string;
  /**
   * Text content added in the post
   * @type {string}
   * @memberof Post
   */
  textContent: string;
  /**
   * List of comments of a post
   * @type {Array<Comment>}
   * @memberof Post
   */
  comments?: Array<Comment>;
  /**
   * Date and time when post was added
   * @type {Date}
   * @memberof Post
   */
  date: Date;
  /**
   * ID of the image attached to the post
   * @type {string}
   * @memberof Post
   */
  imageId?: string;
}
/**
 * All details of the user and their recent activity
 * @export
 * @interface UserDetails
 */
export interface UserDetails {
  /**
   *
   * @type {UserSummary}
   * @memberof UserDetails
   */
  summary: UserSummary;
  /**
   * List of posts user has added
   * @type {Array<BasicPost>}
   * @memberof UserDetails
   */
  posts?: Array<BasicPost>;
  /**
   * List of comments user has added
   * @type {Array<Comment>}
   * @memberof UserDetails
   */
  comments?: Array<Comment>;
}
/**
 * All details of the user
 * @export
 * @interface UserSummary
 */
export interface UserSummary {
  /**
   *
   * @type {string}
   * @memberof UserSummary
   */
  username: string;
  /**
   * URL pointing to the avatar used
   * @type {string}
   * @memberof UserSummary
   */
  avatar?: string;
  /**
   * Date and time of user account creation
   * @type {Date}
   * @memberof UserSummary
   */
  joined: Date;
}

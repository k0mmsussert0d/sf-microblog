from datetime import datetime

from microblog.data.comments import get_comment_doc, put_comment_doc
from microblog.data.id import get_latest_id, update_id
from microblog.data.posts import get_post_doc
from microblog.models.api import NewComment, Comment
from microblog.models.db import CommentDoc
from microblog.models.openid import OpenIdClaims
from microblog.utils.clients import comments_table
from microblog.utils.exceptions import NotFoundError, AuthorizationError
from microblog.utils.odm import CommentODM


def post_comment(comment: NewComment, user_claims: OpenIdClaims) -> Comment:
    post_doc = get_post_doc(comment.postId)
    if post_doc is None or not post_doc.active:
        raise NotFoundError('Post does not exist')

    comment_id = get_latest_id() + 1
    comment_doc = CommentDoc(
        id=comment_id,
        authorSub=user_claims.sub,
        content=comment.textContent,
        date=int(datetime.now().timestamp()),
        postId=comment.postId,
        active=True
    )

    put_comment_doc(comment_doc)
    update_id(comment_id)

    return CommentODM.get_object(comment_doc)


def update_comment(comment_id: int, comment: NewComment, user_claims: OpenIdClaims) -> Comment:
    _assert_user_rights_to_edit_comment(comment_id, user_claims)

    comments_table().update_item(
        Key={
            'id': comment_id
        },
        UpdateExpression='SET content = :c',
        ExpressionAttributeValues={
            ':c': comment.textContent
        }
    )

    res = get_comment_doc(comment_id)
    return CommentODM.get_object(res)


def delete_comment(comment_id: int, user_claims: OpenIdClaims) -> Comment:
    _assert_user_rights_to_edit_comment(comment_id, user_claims)

    comments_table().update_item(
        Key={
            'id': comment_id
        },
        UpdateExpression='SET active = :a',
        ExpressionAttributeValues={
            ':a': 0
        }
    )

    res = get_comment_doc(comment_id)
    return CommentODM.get_object(res)


def _assert_user_rights_to_edit_comment(comment_id, user_claims):
    comment_doc = get_comment_doc(comment_id)
    if comment_doc is None or not comment_doc.active:
        raise NotFoundError('Comment does not exist')
    post_doc = get_post_doc(comment_doc.postId)
    if post_doc is None or not post_doc.active:
        raise NotFoundError('Post does not exist')
    if comment_doc.authorSub != user_claims.sub:
        raise AuthorizationError('User is not authorized to edit this comment')

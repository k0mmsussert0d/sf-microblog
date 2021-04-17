from datetime import datetime
from typing import List, Optional

from pydantic import parse_obj_as

from microblog.data.id import get_latest_id, update_id
from microblog.data.posts import get_post_doc, put_post_doc
from microblog.models.api import NewPost, NewPostWithMedia, Post, PostList
from microblog.models.db import PostDoc
from microblog.models.openid import OpenIdClaims
from microblog.utils.clients import posts_table
from microblog.utils.exceptions import AuthorizationError
from microblog.utils.odm import PostODM


def get_posts() -> PostList:
    res = posts_table().scan()
    if 'Items' not in res:
        return PostList.parse_obj([])

    docs = parse_obj_as(List[PostDoc], res['Items'])

    return PostList.parse_obj([PostODM.get_object(doc) for doc in docs])


def get_post(post_id: int) -> Optional[Post]:
    doc = get_post_doc(post_id)
    if doc is None:
        return None

    return PostODM.get_object(doc)


def post_post(post: NewPost, user_claims: OpenIdClaims) -> Post:
    post_id = get_latest_id() + 1
    new_post_doc = PostDoc(
        id=post_id,
        authorSub=user_claims.sub,
        title=post.title,
        textContent=post.textContent,
        date=int(datetime.now().timestamp())
    )

    put_post_doc(new_post_doc)
    update_id(post_id)

    return PostODM.get_object(new_post_doc)


def post_post_w_media(post_data: NewPostWithMedia, user_claims: OpenIdClaims) -> Post:
    pass


def update_post(post_id: int, post: NewPost, user_claims: OpenIdClaims) -> Post:
    doc = get_post_doc(post_id)
    if doc.authorSub != user_claims.sub:
        raise AuthorizationError('User is not authorized to edit this post')

    posts_table().update_item(
        Key={
            'id': post_id,
        },
        UpdateExpression='SET title = :t, textContent = :tc',
        ExpressionAttributeValues={
            ':t': post.title,
            ':tc': post.textContent
        }
    )

    res = get_post_doc(post_id)
    return PostODM.get_object(res)


def update_post_w_media(post_id: int, post_data: NewPostWithMedia, user_claims: OpenIdClaims) -> Post:
    pass


def delete_post(post_id: int, user_claims: OpenIdClaims) -> Post:
    doc = get_post_doc(post_id)
    if doc.authorSub != user_claims.sub:
        raise AuthorizationError('User is not authorized to delete this post')

    posts_table().delete_item(
        Key={
            'id': post_id
        }
    )

    return PostODM.get_object(doc)

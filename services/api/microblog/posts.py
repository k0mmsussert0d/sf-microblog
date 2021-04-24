import base64
import hashlib
from datetime import datetime
from typing import List, Optional

from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from pydantic import parse_obj_as

from microblog.data.id import get_latest_id, update_id
from microblog.data.posts import get_post_doc, put_post_doc, upload_file
from microblog.models.api import NewPost, NewPostWithMedia, Post, PostList
from microblog.models.db import PostDoc
from microblog.models.middle import NewPostWithMediaMiddle
from microblog.models.openid import OpenIdClaims
from microblog.utils.clients import posts_table
from microblog.utils.exceptions import AuthorizationError, NotFoundError, InternalError
from microblog.utils.odm import PostODM


def get_posts() -> PostList:
    res = posts_table().query(
        IndexName='gsiAllPostsSorted',
        KeyConditionExpression=Key('active').eq(1),
        ScanIndexForward=False
    )
    if 'Items' not in res:
        return PostList.parse_obj([])

    docs = parse_obj_as(List[PostDoc], res['Items'])

    return PostList.parse_obj([PostODM.get_object(doc) for doc in docs])


def get_post(post_id: int, user_claims: Optional[OpenIdClaims]) -> Optional[Post]:
    doc = get_post_doc(post_id)
    if doc is None:
        raise NotFoundError('Post does not exist')
    elif not doc.active:
        if not user_claims or (user_claims and user_claims.sub != doc.authorSub):
            raise AuthorizationError('User is not allowed to view this post')

    return PostODM.get_object(doc)


def post_post(post: NewPost, user_claims: OpenIdClaims) -> Post:
    post_id = get_latest_id() + 1
    new_post_doc = PostDoc(
        id=post_id,
        authorSub=user_claims.sub,
        title=post.title,
        textContent=post.textContent,
        date=int(datetime.now().timestamp()),
        imageId=None
    )

    put_post_doc(new_post_doc)
    update_id(post_id)

    return PostODM.get_object(new_post_doc)


def post_post_w_media(post_data: NewPostWithMediaMiddle, user_claims: OpenIdClaims) -> Post:
    md5 = hashlib.md5(post_data.mediaData)
    file_id = md5.hexdigest()
    post_id = get_latest_id() + 1

    new_post_doc = PostDoc(
        id=post_id,
        authorSub=user_claims.sub,
        title=post_data.postDetails.title,
        textContent=post_data.postDetails.textContent,
        date=int(datetime.now().timestamp()),
        imageId=file_id
    )

    try:
        upload_file(
            post_data.mediaData,
            file_id,
            post_data.content_type,
            md5=base64.b64encode(md5.digest()).decode('utf-8')
        )
    except ClientError:
        raise InternalError('There was in issue while uploading the file to S3 bucket')
    put_post_doc(new_post_doc)
    update_id(post_id)

    return PostODM.get_object(new_post_doc)


def update_post(post_id: int, post: NewPost, user_claims: OpenIdClaims) -> Post:
    doc = get_post_doc(post_id)
    if doc is None:
        raise NotFoundError('Post does not exist')
    elif doc.authorSub != user_claims.sub:
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
    if not doc:
        raise NotFoundError('Post does not exist')
    if doc.authorSub != user_claims.sub:
        raise AuthorizationError('User is not authorized to delete this post')
    elif not doc.active:
        raise AuthorizationError('Post already deleted')

    posts_table().update_item(
        Key={
            'id': post_id,
        },
        UpdateExpression='SET active = :a',
        ExpressionAttributeValues={
            ':a': 0
        }
    )

    return PostODM.get_object(doc)

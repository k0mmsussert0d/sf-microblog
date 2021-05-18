"""
Tests suite validating mapping between API and DB models functions correctly
"""
from datetime import datetime

from boto3_mocks import aws_credentials, cognito_idp, cognito_user, cognito_user_pool, \
    dynamodb_sample_data, dynamodb_comments_table, dynamodb_posts_table, dynamodb
from microblog.models.api import BasicUserDetails, Post, Comment
from microblog.models.db import PostDoc, CommentDoc
from microblog.utils.odm import PostODM, CommentODM


def test_post_from_postdoc_maps_correctly(cognito_user, dynamodb_sample_data, test_data):
    id = 1
    dt = datetime(2021, 1, 1, 12, 0, 0)
    author_uuid = test_data['users'][0]['sub']
    title = 'foo'
    text = 'bar'
    image_id = 'f00bar'

    post_doc = PostDoc(
        id=id,
        authorSub=author_uuid,
        title=title,
        textContent=text,
        imageId=image_id,
        date=int(dt.timestamp())
    )

    post = PostODM.get_object(post_doc)

    assert post.id == id
    assert post.title == title
    assert post.textContent == text
    assert post.date == dt


def test_postdoc_from_post_maps_correctly(cognito_user, test_data):
    id = 1
    dt = datetime(2021, 1, 1, 12, 0, 0)
    author_uuid = test_data['users'][0]['sub']
    title = 'foo'
    text = 'bar'
    image_id = 'f00bar'

    post = Post(
        id=id,
        author=BasicUserDetails(username=test_data['users'][0]['username'], avatar=None),
        title=title,
        textContent=text,
        comments=[],
        date=dt,
        imageId=image_id
    )

    post_doc = PostODM.get_document(post)

    assert post_doc.id == id
    assert post_doc.title == title
    assert post_doc.textContent == text
    assert post_doc.date == int(dt.timestamp())
    assert post_doc.authorSub == author_uuid
    assert post_doc.imageId == image_id


def test_comment_from_commentdoc_maps_correctly(cognito_user, dynamodb_sample_data, test_data):
    id = 2
    dt = datetime(2021, 1, 1, 12, 0, 0)
    content = 'foo'
    author_uuid = test_data['users'][0]['sub']

    comment_doc = CommentDoc(
        id=id,
        date=int(dt.timestamp()),
        content=content,
        authorSub=author_uuid,
        postId=1
    )

    comment = CommentODM.get_object(comment_doc)

    assert comment.id == id
    assert comment.date == dt
    assert comment.content == content
    assert comment.author == BasicUserDetails(username=test_data['users'][0]['nickname'], avatar=None)


def test_commentdoc_from_comment_maps_correctly(cognito_user, test_data):
    id = 2
    dt = datetime(2021, 1, 1, 12, 0, 0)
    author_uuid = test_data['users'][0]['sub']
    content = 'comment content'

    comment = Comment(
        id=id,
        date=dt,
        author=BasicUserDetails(username=test_data['users'][0]['username'], avatar=None),
        content=content
    )

    comment_doc = CommentODM.get_document(comment)

    assert comment_doc.id == comment.id
    assert comment_doc.date == int(dt.timestamp())
    assert comment_doc.authorSub == author_uuid
    assert comment_doc.content == content
    assert comment_doc.postId is None

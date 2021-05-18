from boto3_mocks import aws_credentials, dynamodb, dynamodb_comments_table, dynamodb_posts_table, dynamodb_sample_data
from microblog.models.db import CommentDoc


def test_get_comments_for_post_if_no_comments_return_empty_list(dynamodb_comments_table):
    from microblog.data.comment import get_comments_for_post

    assert get_comments_for_post(1) == []


def test_get_comments_for_post_if_comments_return_list(dynamodb_sample_data, test_data):
    from microblog.data.comment import get_comments_for_post

    comment = test_data['comments'][0]

    assert get_comments_for_post(comment['postId']) == [
        CommentDoc(
            id=comment['id'],
            date=comment['date'],
            postId=comment['postId'],
            content=comment['content'],
            authorSub=comment['authorSub']
        )
    ]

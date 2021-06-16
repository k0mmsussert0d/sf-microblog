from unittest import TestCase

from microblog.models.db import CommentDoc


def test__get_comment_doc__if_comment_does_not_exist__return_none(dynamodb_comments_table):
    from microblog.data.comments import get_comment_doc

    assert get_comment_doc(1) is None


def test__get_comment_doc__if_comment_exists__return_doc(
        test_data,
        dynamodb,
        dynamodb_comments_table,
        dynamodb_sample_data
):
    from microblog.data.comments import get_comment_doc

    comment = test_data['comments'][0]
    comment_id = comment['id']

    assert get_comment_doc(comment_id) == CommentDoc.parse_obj(comment)


def test_get_comments_for_post_if_no_comments_return_empty_list(dynamodb_comments_table):
    from microblog.data.comments import get_comments_for_post

    assert get_comments_for_post(1) == []


def test_get_comments_for_post_if_comments_return_list(dynamodb_sample_data, test_data):
    from microblog.data.comments import get_comments_for_post

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


def test_get_user_comments__if_user_has_comments__return_all_active_comments(
        test_data,
        dynamodb,
        dynamodb_comments_table
):
    from microblog.data.comments import get_user_comments

    user = test_data['users'][0]
    comments = test_data['comments']
    comment_docs = []

    for comment in comments:
        dynamodb.put_item(
            TableName='CommentsTable',
            Item={
                "id": {"N": str(comment['id'])},
                "date": {"N": str(comment['date'])},
                "postId": {"N": str(comment['postId'])},
                "content": {"S": comment['content']},
                "authorSub": {"S": comment['authorSub']},
                "active": {"N": "1" if comment['active'] else "0"}
            }
        )
        if comment['active']:
            comment_docs.append(CommentDoc.parse_obj(comment))

    res = get_user_comments(user['sub'])

    tc = TestCase()
    tc.assertCountEqual(res, comment_docs)


def test_get_user_comments__if_user_has_no_comments__return_empty_list(test_data, dynamodb_comments_table):
    from microblog.data.comments import get_user_comments

    user = test_data['users'][0]

    res = get_user_comments(user['sub'])

    assert res == []

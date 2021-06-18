from unittest import TestCase

from microblog.models.db import PostDoc


def test__get_post_doc__if_post_does_not_exist__return_none(
        dynamodb_posts_table
):
    from microblog.data.posts import get_post_doc

    res = get_post_doc(1)
    assert res is None


def test__get_post_doc__if_post_exists__return_post(
        test_data,
        dynamodb_posts_table
):
    from microblog.data.posts import get_post_doc
    from microblog.utils.clients import posts_table

    post = test_data['posts'][0]
    post_db_format = {**post, 'active': 1 if post['active'] else 0}
    posts_table().put_item(
        Item=post_db_format
    )

    res = get_post_doc(post['id'])

    assert res is not None
    assert res == PostDoc.parse_obj(post_db_format)


def test_get_user_posts__if_user_has_posts__return_all_active_posts(
        test_data,
        dynamodb,
        dynamodb_posts_table,
):
    from microblog.data.posts import get_user_posts
    from microblog.models.db import PostDoc

    user = test_data['users'][0]
    posts = test_data['posts']
    post_docs = []

    for post in posts:
        dynamodb.put_item(
            TableName='PostsTable',
            Item={
                "id": {"N": str(post['id'])},
                "date": {"N": str(post['date'])},
                "textContent": {"S": post['textContent']},
                "title": {"S": post['title']},
                "authorSub": {"S": post['authorSub']},
                "imageId": {"S": post['imageId']} if post['imageId'] else {'NULL': True},
                "active": {"N": "1" if post['active'] else "0"}
            }
        )
        if post['active']:
            post_docs.append(PostDoc(
                id=int(post['id']),
                authorSub=post['authorSub'],
                title=post['title'],
                textContent=post['textContent'],
                date=int(post['date']),
                imageId=None
            ))

    res = get_user_posts(user['sub'])

    tc = TestCase()
    tc.assertCountEqual(res, post_docs)


def test_get_user_posts__if_user_has_no_posts__return_empty_list(
        test_data,
        dynamodb_posts_table
):
    from microblog.data.posts import get_user_posts

    user = test_data['users'][0]

    res = get_user_posts(user['sub'])

    assert res == []

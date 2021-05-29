from unittest import TestCase


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

from typing import Optional, List

from boto3.dynamodb.conditions import Key
from pydantic import parse_obj_as

from microblog.models.db import CommentDoc
from microblog.utils.clients import comments_table


def get_comment_doc(comment_id: int) -> Optional[CommentDoc]:
    res = comments_table().get_item(
        Key={
            'id': comment_id
        }
    )

    if comment_doc := res.get('Item'):
        comment_doc['active'] = (comment_doc['active'] == 1)
        return CommentDoc.parse_obj(comment_doc)

    return None


def put_comment_doc(comment_doc: CommentDoc) -> None:
    db_doc = comment_doc.dict()
    if comment_doc.active:
        db_doc['active'] = 1
    else:
        db_doc['active'] = 0

    comments_table().put_item(
        Item=db_doc
    )


def get_user_comments(user_sub: str) -> List[CommentDoc]:
    res = comments_table().query(
        IndexName='gsiUserComments',
        KeyConditionExpression=Key('authorSub').eq(user_sub),
        FilterExpression=Key('active').eq(1),
        ScanIndexForward=False
    )

    if len(res['Items']) == 0:
        return []

    return parse_obj_as(List[CommentDoc], [CommentDoc.parse_from_dynamodb(c) for c in res['Items']])


def get_comments_for_post(post_id: int) -> List[CommentDoc]:
    table = comments_table()
    response = table.query(
        IndexName="gsiPostComments",
        KeyConditionExpression=Key('postId').eq(post_id),
        FilterExpression=Key('active').eq(1)
    )

    return parse_obj_as(List[CommentDoc], response['Items'])

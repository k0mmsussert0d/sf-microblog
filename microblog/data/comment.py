from typing import List

from boto3.dynamodb.conditions import Key
from pydantic import parse_obj_as

from microblog.models.db import CommentDoc
from microblog.utils.clients import comments_table


def get_comments_for_post(post_id: int) -> List[CommentDoc]:
    table = comments_table()
    response = table.query(
        IndexName="gsiPostComments",
        KeyConditionExpression=Key('postId').eq(post_id)
    )

    return parse_obj_as(List[CommentDoc], response['Items'])

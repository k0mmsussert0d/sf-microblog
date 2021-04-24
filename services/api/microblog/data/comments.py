from typing import Optional

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

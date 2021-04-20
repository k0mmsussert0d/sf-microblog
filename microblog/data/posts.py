from typing import Optional

from microblog.models.db import PostDoc
from microblog.utils.clients import posts_table


def get_post_doc(post_id: int) -> Optional[PostDoc]:
    res = posts_table().get_item(
        Key={
            'id': post_id
        }
    )

    if db_doc := res.get('Item'):
        db_doc['active'] = (db_doc['active'] == 1)
        return PostDoc.parse_obj(res['Item'])

    return None


def put_post_doc(post_doc: PostDoc) -> None:
    db_doc = post_doc.dict()
    if post_doc.active:
        db_doc['active'] = 1
    else:
        db_doc['active'] = 0

    posts_table().put_item(
        Item=db_doc
    )

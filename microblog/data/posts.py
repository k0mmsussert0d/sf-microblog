from typing import Optional

from microblog.models.db import PostDoc
from microblog.utils.clients import posts_table


def get_post_doc(post_id: int) -> Optional[PostDoc]:
    res = posts_table().get_item(
        Key={
            'id': post_id
        }
    )

    if 'Item' not in res:
        return None

    return PostDoc.parse_obj(res['Item'])


def put_post_doc(post_doc: PostDoc) -> None:
    posts_table().put_item(
        Item=post_doc.dict()
    )

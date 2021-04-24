from typing import Optional

from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

from microblog.models.db import PostDoc
from microblog.utils.clients import posts_table, uploads_bucket


logger = Logger()


def get_post_doc(post_id: int) -> Optional[PostDoc]:
    res = posts_table().get_item(
        Key={
            'id': post_id
        }
    )

    if db_doc := res.get('Item'):
        db_doc['active'] = (db_doc['active'] == 1)
        return PostDoc.parse_obj(db_doc)

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


def upload_file(file: bytes, name: str, content_type: str, metadata: dict = {}, md5: str = None) -> None:
    try:
        uploads_bucket().put_object(
            Body=file,
            Key=name,
            ContentType=content_type,
            Metadata=metadata,
            ContentMD5=md5
        )
    except ClientError as e:
        logger.error('Error while uploading file to S3', e)
        raise e

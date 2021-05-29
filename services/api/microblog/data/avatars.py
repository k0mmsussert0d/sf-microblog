import base64
import hashlib
import io
from typing import Optional

from aws_lambda_powertools import Logger
from botocore.exceptions import ClientError

from microblog.models.middle import S3Object
from microblog.utils.clients import avatars_bucket
from microblog.utils.exceptions import InternalError

logger = Logger()


def get_avatar_object(username: str) -> Optional[S3Object]:
    try:
        obj = avatars_bucket().Object(username)
        obj.load()

        with io.BytesIO() as file_stream:
            obj.download_fileobj(file_stream)
            return S3Object(
                content=file_stream.getvalue(),
                content_type=obj.content_type,
            )
    except ClientError as e:
        if e.response['Error']['Code'] == 404:
            return None
        else:
            raise e


def upload_avatar(avatar: bytes, username: str) -> None:
    try:
        avatars_bucket().put_object(
            Body=avatar,
            Key=username,
            ContentType='image/png',
            ContentMD5=base64.b64encode(hashlib.md5(avatar).digest()).decode('utf-8')
        )
    except ClientError:
        logger.error('There was an issue while uploading the avatar to S3 bucket')
        raise InternalError

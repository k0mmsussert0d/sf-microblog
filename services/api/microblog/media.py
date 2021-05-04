import io

from botocore.exceptions import ClientError

from microblog.models.middle import S3Object
from microblog.utils.clients import uploads_bucket
from microblog.utils.exceptions import NotFoundError


def get_media_from_s3(object_name: str) -> S3Object:
    try:
        obj = uploads_bucket().Object(object_name)
        obj.load()

        with io.BytesIO() as file_stream:
            obj.download_fileobj(file_stream)
            return S3Object(
                content=file_stream.getvalue(),
                content_type=obj.content_type
            )
    except ClientError as e:
        if e.response['Error']['Code'] == 404:
            raise NotFoundError('No such object in S3 bucket')
        else:
            raise

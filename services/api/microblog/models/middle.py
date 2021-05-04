from pydantic import BaseModel

from microblog.models.api import NewPostWithMedia


class NewPostWithMediaMiddle(NewPostWithMedia):
    content_type: str


class S3Object(BaseModel):
    content: bytes
    content_type: str

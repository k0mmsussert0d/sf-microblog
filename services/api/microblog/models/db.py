from typing import Optional

from microblog.models.base_model import BaseModel


class PostDoc(BaseModel):
    id: int
    authorSub: str
    title: str
    textContent: str
    imageId: Optional[str] = ...
    date: int
    active: bool = True

    @classmethod
    def parse_from_dynamodb(cls, d: dict):
        if 'active' not in d:
            raise ValueError('Incorrect schema for PostDoc DynamoDB entry. Missing active key.')
        d['active'] = (d['active'] == 1)
        return cls.parse_obj(d)


class CommentDoc(BaseModel):
    id: int
    authorSub: str
    content: str
    date: int
    postId: int = None
    active: bool = True

    @classmethod
    def parse_from_dynamodb(cls, d: dict):
        if 'active' not in d:
            raise ValueError('Incorrect schema for CommentDoc DynamoDB entry. Missing active key.')
        d['active'] = (d['active'] == 1)
        return cls.parse_obj(d)

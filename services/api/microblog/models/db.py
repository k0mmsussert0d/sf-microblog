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


class CommentDoc(BaseModel):
    id: int
    authorSub: str
    content: str
    date: int
    postId: int
    active: bool = True

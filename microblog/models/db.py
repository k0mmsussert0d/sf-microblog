from microblog.models.base_model import BaseModel


class PostDoc(BaseModel):
    id: int
    authorSub: str
    title: str
    textContent: str
    imageId: str
    date: int


class CommentDoc(BaseModel):
    id: int
    authorSub: str
    content: str
    date: int

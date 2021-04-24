from datetime import datetime
from typing import Protocol, TypeVar

from microblog.data.comment import get_comments_for_post
from microblog.data.user import get_basic_user_details, get_user_sub
from microblog.models.api import Post, Comment
from microblog.models.db import PostDoc, CommentDoc

Obj = TypeVar('Obj')
Doc = TypeVar('Doc')


class ObjectDocumentMapper(Protocol[Obj, Doc]):

    @staticmethod
    def get_object(document: Doc) -> Obj:
        pass

    @staticmethod
    def get_document(obj: Obj) -> Doc:
        pass


class PostODM:

    @staticmethod
    def get_object(document: PostDoc) -> Post:
        return Post.parse_obj({
            'id': document.id,
            'author': get_basic_user_details(document.authorSub),
            'title': document.title,
            'textContent': document.textContent,
            'comments': [CommentODM.get_object(d) for d in get_comments_for_post(document.id)],
            'date': datetime.fromtimestamp(document.date),
            'imageId': document.imageId,
        })

    @staticmethod
    def get_document(obj: Post) -> PostDoc:
        return PostDoc.parse_obj({
            'id': obj.id,
            'title': obj.title,
            'textContent': obj.textContent,
            'date': int(obj.date.timestamp()),
            'authorSub': get_user_sub(obj.author.username),
            'imageId': obj.imageId,
        })


class CommentODM:

    @staticmethod
    def get_object(document: CommentDoc) -> Comment:
        return Comment.parse_obj({
            'id': document.id,
            'author': get_basic_user_details(document.authorSub),
            'content': document.content,
            'date': datetime.fromtimestamp(document.date),
        })

    @staticmethod
    def get_document(obj: Comment) -> CommentDoc:
        return CommentDoc.parse_obj({
            'id': obj.id,
            'authorSub': get_user_sub(obj.author.username),
            'content': obj.content,
            'date': int(obj.date.timestamp())
        })

from microblog.models.api import NewPostWithMedia


class NewPostWithMediaMiddle(NewPostWithMedia):
    content_type: str

from datetime import datetime
from typing import List

from microblog.models.api import NewPost, NewPostWithMedia, Post, BasicUserDetails
from microblog.models.openid import OpenIdClaims


def get_posts() -> List[Post]:
    pass


def get_post(post_id: int) -> Post:
    pass


def post_post(post: NewPost, user_claims: OpenIdClaims) -> Post:
    return Post(
        id=1,
        author=BasicUserDetails(
            username='username',
        ),
        title=post.title,
        textContent=post.textContent,
        date=datetime.now()
    )


def post_post_w_media(post_data: NewPostWithMedia, user_claims: OpenIdClaims) -> Post:
    pass


def update_post(post_id: int, post: NewPost, user_claims: OpenIdClaims) -> Post:
    pass


def update_post_w_media(post_id: int, post_data: NewPostWithMedia, user_claims: OpenIdClaims) -> Post:
    pass


def delete_post(post_id: int, user_claims: OpenIdClaims) -> Post:
    pass

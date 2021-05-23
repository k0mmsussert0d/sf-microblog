from typing import Optional

from microblog.data.comments import get_user_comments
from microblog.data.posts import get_user_posts

from microblog.data.user import get_user_summary, set_user_avatar, get_user_sub
from microblog.models.api import NewUserDetails, UserDetails, UserSummary
from microblog.models.openid import OpenIdClaims
from microblog.utils.odm import PostODM, CommentODM


def get_user_self_details(user_claims: OpenIdClaims) -> UserSummary:
    return get_user_summary(user_claims.sub)


def update_user_self_details(user_details: NewUserDetails, user_claims: OpenIdClaims) -> UserSummary:
    set_user_avatar(user_claims.sub, user_details.avatar)

    return get_user_summary(user_claims.sub)


def get_user_details(username: str) -> Optional[UserDetails]:
    user_sub = get_user_sub(username)
    summary = get_user_summary(user_sub)
    if summary is None:
        return None

    return UserDetails(
        summary=summary,
        posts=[PostODM.get_basic_post(p) for p in get_user_posts(user_sub)],
        comments=[CommentODM.get_object(c) for c in get_user_comments(user_sub)]
    )

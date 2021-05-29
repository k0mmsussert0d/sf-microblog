from microblog.data.avatars import upload_avatar, get_avatar_object
from microblog.data.user import get_user_sub, set_user_avatar, get_user_summary
from microblog.models.middle import S3Object
from microblog.models.openid import OpenIdClaims
from microblog.utils.exceptions import NotFoundError


def get_avatar(username: str) -> S3Object:
    sub = get_user_sub(username)
    user = get_user_summary(sub)
    if not user:
        raise NotFoundError('User unavailable')

    if obj := get_avatar_object(username):
        return obj
    else:
        raise NotFoundError('No avatar set for this user')


def set_avatar(avatar: bytes, user_claims: OpenIdClaims) -> None:
    username = user_claims.preferred_username
    upload_avatar(avatar, username)
    user_sub = get_user_sub(username)
    set_user_avatar(user_sub, f'/{username}')

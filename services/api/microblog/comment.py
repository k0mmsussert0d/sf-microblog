from microblog.models.api import NewComment, Comment
from microblog.models.openid import OpenIdClaims


def post_comment(comment: NewComment, user_claims: OpenIdClaims) -> Comment:
    pass


def update_comment(comment_id: int, comment: NewComment, user_claims: OpenIdClaims) -> Comment:
    pass


def delete_comment(comment_id: int, user_claims: OpenIdClaims) -> Comment:
    pass

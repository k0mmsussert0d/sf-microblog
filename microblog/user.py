from microblog.models.api import BasicUserDetails, NewUserDetails, UserDetails
from microblog.models.openid import OpenIdClaims


def get_user_self_details(user_claims: OpenIdClaims) -> BasicUserDetails:
    pass


def update_user_self_details(user_details: NewUserDetails, user_claims: OpenIdClaims) -> BasicUserDetails:
    pass


def get_user_details(username: str) -> UserDetails:
    pass

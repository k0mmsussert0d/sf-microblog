import os

from microblog.models.api import NewUserDetails
from microblog.models.openid import OpenIdClaims
from microblog.utils.dict import extract_attribute


def test_get_user_self_details__return_details_of_user_referenced_in_claims(cognito_user, test_data):
    from microblog.utils.clients import cognito
    from microblog.user import get_user_self_details

    user = test_data['users'][0]
    user_in_cognito = cognito().admin_get_user(UserPoolId=os.environ['COGNITO_USER_POOL_ID'], Username=user['username'])

    claims = OpenIdClaims(
        sub=user['sub'],
        preferred_username=user['preferred_username'],
    )

    details = get_user_self_details(claims)

    assert details.username == user['preferred_username']
    if not user['avatar']:
        assert details.avatar is None
    else:
        assert details.avatar == user['avatar']
    assert details.joined == user_in_cognito['UserCreateDate']


def test_update_user_self_details__update_avatar_property_of_user_referenced_in_claims(cognito_user, test_data):
    from microblog.user import update_user_self_details
    from microblog.utils.clients import cognito

    user = test_data['users'][0]
    avatar_url = 'http://example.com/avatar.png'

    claims = OpenIdClaims(
        sub=user['sub'],
        preferred_username=user['preferred_username'],
    )

    updated_user = update_user_self_details(
        NewUserDetails(avatar=avatar_url),
        claims
    )

    assert updated_user.avatar == avatar_url
    user_in_cognito = cognito().admin_get_user(UserPoolId=os.environ['COGNITO_USER_POOL_ID'], Username=user['username'])
    assert extract_attribute(user_in_cognito['UserAttributes'], 'picture') == avatar_url


def test_get_user_details__return_details__if_user_exists(cognito_user, dynamodb_sample_data, test_data):
    from microblog.user import get_user_details

    user = test_data['users'][0]
    post = test_data['posts'][0]
    comment = test_data['comments'][0]

    res = get_user_details(user['preferred_username'])

    assert res.summary.username == user['preferred_username']
    if res.summary.avatar:
        assert res.summary.avatar == user['avatar']
    else:
        assert res.summary.avatar is None
    assert res.summary.joined == cognito_user['UserCreateDate']

    assert len(res.posts) == 1
    assert res.posts[0].id == post['id']

    assert len(res.comments) == 1
    assert res.comments[0].id == comment['id']


def test_get_user_details__return_none__if_no_user_with_such_username(cognito_user_pool):
    from microblog.user import get_user_details

    res = get_user_details('non_existent_username')

    assert res is None


def test_get_user_details__return_none__if_user_account_is_disabled(cognito_disabled_user, test_data):
    from microblog.user import get_user_details

    user = test_data['users'][0]

    assert get_user_details(user['preferred_username']) is None


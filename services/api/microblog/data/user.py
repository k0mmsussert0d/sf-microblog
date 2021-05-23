import os
from typing import Optional

from microblog.models.api import BasicUserDetails, UserSummary
from microblog.utils.clients import cognito
from microblog.utils.dict import extract_attribute


def get_basic_user_details(user_sub: str) -> Optional[BasicUserDetails]:
    summary = get_user_summary(user_sub)
    if summary is None:
        return None

    return BasicUserDetails(
        username=summary.username,
        avatar=summary.avatar
    )


def get_user_summary(user_sub: str) -> Optional[UserSummary]:
    client = cognito()
    res = client.list_users(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID'],
        Filter=f'sub = "{user_sub}"',
        Limit=1
    )

    if len(res['Users']) == 0:
        return None
    elif not res['Users'][0]['Enabled']:
        return None

    return UserSummary(
        username=extract_attribute(res['Users'][0]['Attributes'], 'preferred_username'),
        avatar=extract_attribute(res['Users'][0]['Attributes'], 'picture'),
        joined=res['Users'][0]['UserCreateDate']
    )


def set_user_avatar(user_sub: str, avatar_url: str) -> None:
    cognito().admin_update_user_attributes(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID'],
        Username=user_sub,
        UserAttributes=[
            {
                'Name': 'picture',
                'Value': avatar_url
            }
        ]
    )


def get_user_sub(username: str) -> Optional[str]:
    client = cognito()
    res = client.list_users(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID'],
        AttributesToGet=['sub'],
        Filter=f'preferred_username="{username}"'
    )

    if len(res['Users']) == 0:
        return None

    return extract_attribute(res['Users'][0]['Attributes'], 'sub')

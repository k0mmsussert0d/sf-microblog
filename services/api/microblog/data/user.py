import os
from typing import Optional

from microblog.models.api import BasicUserDetails
from microblog.utils.clients import cognito
from microblog.utils.dict import extract_attribute


def get_basic_user_details(user_sub: str) -> Optional[BasicUserDetails]:
    client = cognito()
    res = client.list_users(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID'],
        Filter=f'sub = "{user_sub}"',
        Limit=1
    )

    if len(res['Users']) == 0:
        return None

    return BasicUserDetails(
        username=extract_attribute(res['Users'][0]['Attributes'], 'nickname'),
        avatar=extract_attribute(res['Users'][0]['Attributes'], 'avatar')
    )


def get_user_sub(username: str) -> Optional[str]:
    client = cognito()
    res = client.list_users(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID'],
        AttributesToGet=['sub'],
        Filter=f'username={username}'
    )

    if len(res['Users']) == 0:
        return None

    return extract_attribute(res['Users'][0]['Attributes'], 'sub')

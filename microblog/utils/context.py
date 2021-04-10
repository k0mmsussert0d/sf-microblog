import base64
import json
from typing import Union


def get_event_body(event) -> Union[dict, str]:
    if 'body' not in event:
        return ''

    if event.get('isBase64Encoded', False):
        body = base64.b64decode(event['body']).decode('ascii')
    else:
        body = event['body']

    if event['headers'].get('contentType', 'application/json'):
        body = json.loads(body)

    return body


def get_user_data(event):
    return event.get('requestContext', {})\
            .get('authorizer', {})\
            .get('jwt', {})\
            .get('claims', {})

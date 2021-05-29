import base64

from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.utilities.parser import parse, ValidationError

from microblog.avatars import set_avatar, get_avatar
from microblog.comment import post_comment, update_comment, delete_comment
from microblog.media import get_media_from_s3
from microblog.models.api import NewPost, NewPostWithMedia, NewComment
from microblog.models.middle import NewPostWithMediaMiddle
from microblog.models.openid import OpenIdClaims
from microblog.posts import get_posts, post_post, get_post, update_post, delete_post, post_post_w_media, \
    update_post_w_media
from microblog.user import get_user_self_details, get_user_details
from microblog.utils.exceptions import AuthorizationError, NotFoundError
from microblog.utils.parser import ApiGatewayProxyV2Envelope, get_binary_body_from_event

logger = Logger()


@logger.inject_lambda_context()
def posts(event, _):
    logger.debug(event)
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    logger.debug(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    content_type = event.headers.get('content-type', 'application/json')
    if authorizer := event.request_context.authorizer:
        user_claims = OpenIdClaims.parse_obj(authorizer.jwt_claim)
    else:
        user_claims = None

    try:
        if not path_params:
            if method == 'GET':
                return {
                    'statusCode': 200,
                    'body': get_posts().json(),
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }

            elif method == 'POST':
                if 'application/json' in content_type:
                    # noinspection PyTypeChecker
                    body: NewPost = parse(event, NewPost, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 201,
                        'body': post_post(body, user_claims).json(),
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    }

                elif 'multipart/form-data' in content_type:
                    # noinspection PyTypeChecker
                    body: NewPostWithMediaMiddle = parse(event, NewPostWithMediaMiddle, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 201,
                        'body': post_post_w_media(body, user_claims).json()
                    }

        elif 'id' in path_params:
            post_id = int(path_params['id'])

            if method == 'GET':
                try:
                    return {
                        'statusCode': 200,
                        'body': get_post(post_id, user_claims).json(),
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    }
                except AuthorizationError:
                    return {
                        'statusCode': 403
                    }
                except NotFoundError:
                    return {
                        'statusCode': 404
                    }

            elif method == 'PUT':
                if content_type == 'application/json':
                    # noinspection PyTypeChecker
                    body: NewPost = parse(event, NewPost, ApiGatewayProxyV2Envelope)
                    try:
                        return {
                            'statusCode': 200,
                            'body': update_post(post_id, body, user_claims).json(),
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        }
                    except AuthorizationError:
                        return {
                            'statusCode': 403
                        }
                    except NotFoundError:
                        return {
                            'statusCode': 404
                        }

                elif content_type == 'multipart/form-data':
                    # noinspection PyTypeChecker
                    body: NewPostWithMedia = parse(event, NewPostWithMedia, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 200,
                        'body': update_post_w_media(post_id, body, user_claims).json()
                    }

            elif method == 'DELETE':
                try:
                    return {
                        'statusCode': 200,
                        'body': delete_post(post_id, user_claims).json(),
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    }
                except AuthorizationError:
                    return {
                        'statusCode': 403
                    }
                except NotFoundError:
                    return {
                        'statusCode': 404
                    }

    except ValidationError as e:
        logger.error(e.errors(), exc_info=True)
        return {
            'statusCode': 400,
            'body': 'Malformed request body'
        }

    return {
        'statusCode': 405
    }


@logger.inject_lambda_context()
def comment(event, _):
    logger.debug(event)
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    user_claims = OpenIdClaims.parse_obj(event.request_context.authorizer.jwt_claim)

    try:
        if not path_params:
            if method == 'POST':
                # noinspection PyTypeChecker
                body: NewComment = parse(event, NewComment, ApiGatewayProxyV2Envelope)
                return {
                    'statusCode': 200,
                    'body': post_comment(body, user_claims).json()
                }

        elif 'id' in path_params:
            comment_id = int(path_params['id'])
            if method == 'PUT':
                # noinspection PyTypeChecker
                body: NewComment = parse(event, NewComment, ApiGatewayProxyV2Envelope)
                try:
                    return {
                        'statusCode': 200,
                        'body': update_comment(comment_id, body, user_claims).json()
                    }
                except AssertionError:
                    return {
                        'statusCode': 400
                    }
                except AuthorizationError:
                    return {
                        'statusCode': 403
                    }
                except NotFoundError:
                    return {
                        'statusCode': 404
                    }

            elif method == 'DELETE':
                delete_comment(comment_id, user_claims)
                return {
                    'statusCode': 204
                }
    except ValidationError as e:
        logger.error(e.errors(), exc_info=True)
        return {
            'statusCode': 400,
            'body': 'Malformed request body'
        }

    return {
        'statusCode': 405
    }


@logger.inject_lambda_context()
def user(event, _):
    logger.debug(event)
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    if authorizer := event.request_context.authorizer:
        user_claims = OpenIdClaims.parse_obj(authorizer.jwt_claim)
    else:
        user_claims = None

    if not path_params:
        if method == 'GET':
            return {
                'statusCode': 200,
                'body': get_user_self_details(user_claims).json()
            }

    elif username := path_params.get('username'):
        if method == 'GET':
            return {
                'statusCode': 200,
                'body': get_user_details(username).json()
            }

    return {
        'statusCode': 401
    }


@logger.inject_lambda_context()
def media(event, _):
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    logger.debug(event)
    method = event.request_context.http.method
    path_params = event.path_parameters

    if 'id' in path_params:
        if method == 'GET':
            try:
                obj = get_media_from_s3(path_params['id'])
                return {
                    'statusCode': 200,
                    'body': base64.b64encode(obj.content),
                    'headers': {
                        'Content-Type': obj.content_type
                    },
                    'isBase64Encoded': True
                }
            except NotFoundError:
                return {
                    'statusCode': 404
                }

    return {
        'statusCode': 405
    }


@logger.inject_lambda_context()
def avatar(event, _):
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    logger.debug(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    content_type = event.headers.get('content-type', 'application/json')

    if not path_params:
        if method == 'PUT':
            user_claims = OpenIdClaims.parse_obj(event.request_context.authorizer.jwt_claim)
            if 'image/png' in content_type:
                body = get_binary_body_from_event(event)
                set_avatar(body, user_claims)
                return {
                    'statusCode': 204
                }
            else:
                return {
                    'statusCode': 400
                }

    elif 'username' in path_params:
        if method == 'GET':
            try:
                obj = get_avatar(path_params['username'])
                return {
                    'statusCode': 200,
                    'body': base64.b64encode(obj.content),
                    'headers': {
                        'Content-Type': obj.content_type
                    },
                    'isBase64Encoded': True
                }
            except NotFoundError as e:
                return {
                    'statusCode': 404
                }

    return {
        'statusCode': 405
    }

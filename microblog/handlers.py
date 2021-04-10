from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.utilities.parser import parse, ValidationError

from microblog.comment import post_comment, update_comment, delete_comment
from microblog.models.api import NewPost, NewPostWithMedia, NewComment, NewUserDetails
from microblog.models.openid import OpenIdClaims
from microblog.posts import get_posts, post_post, get_post, update_post, delete_post, post_post_w_media, \
    update_post_w_media
from microblog.user import get_user_self_details, update_user_self_details, get_user_details
from microblog.utils.parser import ApiGatewayProxyV2Envelope


def posts(event, _):
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    content_type = event.headers.get('Content-Type', 'application/json')
    user_claims = OpenIdClaims.parse_obj(event.request_context.authorizer.jwt_claim)

    try:
        if not path_params:
            if method == 'GET':
                return {
                    'statusCode': 200,
                    'body': get_posts()
                }

            elif method == 'POST':
                if content_type == 'application/json':
                    # noinspection PyTypeChecker
                    body: NewPost = parse(event, NewPost, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 200,
                        'body': post_post(body, user_claims).json()
                    }

                elif content_type == 'multipart/form-data':
                    # noinspection PyTypeChecker
                    body: NewPostWithMedia = parse(event, NewPostWithMedia, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 200,
                        'body': post_post_w_media(body, user_claims).json()
                    }

        elif 'id' in path_params:
            post_id = int(path_params['id'])

            if method == 'GET':
                return {
                    'statusCode': 200,
                    'body': get_post(post_id).json()
                }

            elif method == 'PUT':
                if content_type == 'application/json':
                    # noinspection PyTypeChecker
                    body: NewPost = parse(event, NewPost, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 200,
                        'body': update_post(post_id, body, user_claims).json()
                    }

                elif content_type == 'multipart/form-data':
                    # noinspection PyTypeChecker
                    body: NewPostWithMedia = parse(event, NewPostWithMedia, ApiGatewayProxyV2Envelope)
                    return {
                        'statusCode': 200,
                        'body': update_post_w_media(post_id, body, user_claims).json()
                    }

            elif method == 'DELETE':
                return {
                    'statusCode': 200,
                    'body': delete_post(post_id, user_claims).json()
                }

    except ValidationError:
        return {
            'statusCode': 400,
            'body': 'Malformed request body'
        }

    return {
        'statusCode': 401
    }


def comment(event, _):
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    user_claims = OpenIdClaims.parse_obj(event.request_context.authorizer.jwt_claim)

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
            return {
                'statusCode': 200,
                'body': update_comment(comment_id, body, user_claims).json()
            }

        elif method == 'DELETE':
            delete_comment(comment_id, user_claims)
            return {
                'statusCode': 204
            }

    return {
        'statusCode': 401
    }


def user(event, _):
    event: APIGatewayProxyEventV2 = APIGatewayProxyEventV2(event)
    method = event.request_context.http.method
    path_params = event.path_parameters
    user_claims = OpenIdClaims.parse_obj(event.request_context.authorizer.jwt_claim)

    if not path_params:
        if method == 'GET':
            return {
                'statusCode': 200,
                'body': get_user_self_details(user_claims)
            }

        elif method == 'PUT':
            # noinspection PyTypeChecker
            body: NewUserDetails = parse(event, NewUserDetails, ApiGatewayProxyV2Envelope)
            return {
                'statusCode': 200,
                'body': update_user_self_details(body, user_claims)
            }

    elif username := path_params.get('username'):
        if method == 'GET':
            return {
                'statusCode': 200,
                'body': get_user_details(username)
            }

    return {
        'statusCode': 401
    }
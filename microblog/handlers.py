from microblog.comment import post_comment, update_comment, delete_comment
from microblog.posts import get_posts, post_post, get_post, update_post, delete_post
from microblog.user import get_user_self_details, update_user_self_details, get_user_details
from microblog.utils.context import get_event_body, get_user_data


def posts(event, context):
    method = event.get('httpMethod')
    path_params = event.get('pathParameters', {})
    body = get_event_body(event)
    user_claims = get_user_data(event)

    if not path_params:
        if method == 'GET':
            return get_posts()
        elif method == 'POST' and type(body) == dict:
            return post_post(body, user_claims)
    elif 'id' in path_params:
        post_id = path_params['id']
        if method == 'GET':
            return get_post(post_id)
        elif method == 'PUT' and type(body) == dict:
            return update_post(post_id, body, user_claims)
        elif method == 'DELETE':
            return delete_post(post_id, user_claims)

    return {
        'statusCode': 401
    }


def comment(event, context):
    method = event.get('httpMethod')
    path_params = event.get('pathParameters', {})
    body = get_event_body(event)
    user_claims = get_user_data(event)

    if not path_params:
        if method == 'POST':
            return post_comment(body, user_claims)
    elif comment_id := path_params.get('id'):
        if method == 'PUT' and type(body) == dict:
            update_comment(comment_id, body, user_claims)
        elif method == 'DELETE':
            delete_comment(comment_id, user_claims)

    return {
        'statusCode': 401
    }


def user(event, context):
    method = event.get('httpMethod')
    path_params = event.get('pathParameters', {})
    body = get_event_body(event)
    user_claims = get_user_data(event)

    if not path_params:
        if method == 'GET':
            return get_user_self_details(user_claims)
        elif method == 'PUT':
            return update_user_self_details(body, user_claims)
    elif username := path_params.get('username'):
        if method == 'GET':
            return get_user_details(username)

    return {
        'statusCode': 401
    }

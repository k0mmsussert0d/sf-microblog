def test_get_basic_user_details__return_details_if_user_exists(cognito_user, test_data):
    from microblog.data.user import get_basic_user_details

    user = test_data['users'][0]

    res = get_basic_user_details(user['sub'])

    assert res.username == user['preferred_username']
    if user['avatar']:
        assert res.avatar == user['avatar']
    else:
        assert res.avatar is None


def test_get_basic_user_details__return_none_if_user_does_not_exists(cognito_user_pool):
    from microblog.data.user import get_basic_user_details

    res = get_basic_user_details('non_existent_user_sub')

    assert res is None


def test_get_basic_user_details__return_none_if_user_is_disabled(cognito_disabled_user, test_data):
    from microblog.data.user import get_basic_user_details

    user = test_data['users'][0]
    res = get_basic_user_details(user['sub'])

    assert res is None


def test_get_user_summary__return_summary_if_user_exists(cognito_user, test_data):
    from microblog.data.user import get_user_summary

    user = test_data['users'][0]

    res = get_user_summary(user['sub'])

    assert res.username == user['preferred_username']
    if user['avatar']:
        assert res.avatar == user['avatar']
    else:
        assert res.avatar is None
    assert res.joined == cognito_user['UserCreateDate']


def test_get_user_summary__return_none_if_user_does_not_exists(cognito_user_pool):
    from microblog.data.user import get_user_summary

    res = get_user_summary('non_existent_user')
    assert res is None


def test_get_user_summary__return_none_if_user_is_disabled(cognito_disabled_user, test_data):
    from microblog.data.user import get_user_summary

    user = test_data['users'][0]

    res = get_user_summary(user['sub'])
    assert res is None


def test_get_user_sub__return_sub_if_user_exists(cognito_user, test_data):
    from microblog.data.user import get_user_sub

    user = test_data['users'][0]

    res = get_user_sub(user['preferred_username'])

    assert res == user['sub']


def test_get_user_sub__return_none_if_user_does_not_exists(cognito_user_pool):
    from microblog.data.user import get_user_sub

    res = get_user_sub('non_existent_username')

    assert res is None

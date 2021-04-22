import pytest

from boto3_mocks import aws_credentials, dynamodb, dynamodb_posts_table, dynamodb_comments_table, dynamodb_sample_data
from microblog.data.id import get_latest_id, update_id
from microblog.utils.clients import posts_table


@pytest.fixture(scope='function')
def dynamodb_latest_id(dynamodb, dynamodb_sample_data):
    dynamodb.put_item(
        TableName='PostsTable',
        Item={
            "id": {"N": "-1"},
            "latestId": {"N": "2"}
        }
    )
    yield
    dynamodb.delete_item(
        TableName='PostsTable',
        Key={
            'id': {'N': '-1'}
        }
    )


def test_get_latest_id_return_0_if_no_record(dynamodb_posts_table):
    assert get_latest_id() == 0


def test_get_latest_id_return_value_if_record_exists(dynamodb_latest_id):
    assert get_latest_id() == 2


def test_update_id_create_item_if_does_not_exist(dynamodb_posts_table):
    new_id = 1
    update_id(new_id)
    res = posts_table().get_item(
        Key={
            'id': -1
        }
    )
    assert 'Item' in res
    assert res['Item'] == {
        'id': -1,
        'latestId': 1
    }


def test_update_id_update_item_if_exists_and_is_smaller(dynamodb_latest_id):
    new_id = 3
    update_id(new_id)
    res = posts_table().get_item(
        Key={
            'id': -1
        }
    )
    assert 'Item' in res
    assert res['Item'] == {
        'id': -1,
        'latestId': 3
    }


def test_update_id_do_not_update_item_if_exists_and_is_larger(dynamodb_latest_id):
    new_id = 1
    update_id(new_id)
    res = posts_table().get_item(
        Key={
            'id': -1
        }
    )
    assert 'Item' in res
    assert res['Item'] == {
        'id': -1,
        'latestId': 2
    }

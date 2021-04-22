import os
from unittest import mock

import boto3
import pytest
from moto import mock_dynamodb2, mock_cognitoidp


@pytest.fixture(scope='function')
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    os.environ['AWS_SESSION_TOKEN'] = 'testing'


@pytest.fixture(scope='function')
def dynamodb(aws_credentials):
    with mock_dynamodb2():
        yield boto3.client('dynamodb', region_name='us-east-1')


@pytest.fixture(scope='function')
def dynamodb_posts_table(dynamodb):
    table = dynamodb.create_table(
        TableName='PostsTable',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'date',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'authorSub',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'active',
                'AttributeType': 'N'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'gsiUserPosts',
                'KeySchema': [
                    {
                        'AttributeName': 'authorSub',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            },
            {
                'IndexName': 'gsiAllPostsSorted',
                'KeySchema': [
                    {
                        'AttributeName': 'active',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'date',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    return table


@pytest.fixture(scope='function')
def dynamodb_comments_table(dynamodb):
    table = dynamodb.create_table(
        TableName='CommentsTable',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'postId',
                'AttributeType': 'N'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'gsiPostComments',
                'KeySchema': [
                    {
                        'AttributeName': 'postId',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'id',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                }
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    return table


@pytest.fixture(scope='function')
def dynamodb_sample_data(dynamodb, dynamodb_posts_table, dynamodb_comments_table):
    dynamodb.put_item(
        TableName='PostsTable',
        Item={
            "id": {"N": "1"},
            "date": {"N": "1618527983"},
            "textContent": {"S": "Text content of a post"},
            "title": {"S": "Title of a post"},
            "authorSub": {"S": "b7d5ab35-7c77-456d-83e8-7728de57ed54"}
        }
    )
    dynamodb.put_item(
        TableName='CommentsTable',
        Item={
            "id": {"N": "2"},
            "date": {"N": "1618527988"},
            "postId": {"N": "1"},
            "content": {"S": "Content of a post"},
            "authorSub": {"S": "b7d5ab35-7c77-456d-83e8-7728de57ed54"}
        }
    )
    yield
    dynamodb.delete_item(
        TableName='PostsTable',
        Key={
            'id': {'N': '1'}
        }
    )
    dynamodb.delete_item(
        TableName='CommentsTable',
        Key={
            'id': {'N': '4'}
        }
    )


@pytest.fixture(scope='function')
def cognito_idp(aws_credentials):
    with mock_cognitoidp():
        yield boto3.client('cognito-idp', region_name='us-east-1')


@pytest.fixture(scope='function')
def cognito_user_pool(cognito_idp):
    user_pool = cognito_idp.create_user_pool(
        PoolName='microblog-test-user-pool',
    )
    user_pool_id = user_pool['UserPool']['Id']

    with mock.patch.dict(os.environ, {'COGNITO_USER_POOL_ID': user_pool_id}):
        yield user_pool

    cognito_idp.delete_user_pool(
        UserPoolId=user_pool_id
    )


@pytest.fixture(scope='function')
def cognito_user(cognito_idp, cognito_user_pool):
    user_pool_id = cognito_user_pool['UserPool']['Id']
    cognito_idp.admin_create_user(
        UserPoolId=user_pool_id,
        Username='username',
        UserAttributes=[
            {
                'Name': 'username',
                'Value': 'username'
            },
            {
                'Name': 'sub',
                'Value': 'b7d5ab35-7c77-456d-83e8-7728de57ed54'
            }
        ]
    )
    yield
    cognito_idp.admin_delete_user(
        UserPoolId=user_pool_id,
        Username='username',
    )

import os

import boto3
from mypy_boto3_cognito_idp.client import CognitoIdentityProviderClient
from mypy_boto3_dynamodb.service_resource import DynamoDBServiceResource, Table


def cognito() -> CognitoIdentityProviderClient:
    return boto3.client('cognito-idp')


def dynamodb() -> DynamoDBServiceResource:
    return boto3.resource('dynamodb')


def posts_table() -> Table:
    return dynamodb().Table(os.environ['POSTS_TABLE'])


def comments_table() -> Table:
    return dynamodb().Table(os.environ['COMMENTS_TABLE'])

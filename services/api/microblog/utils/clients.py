import os

import boto3
from mypy_boto3_cognito_idp.client import CognitoIdentityProviderClient
from mypy_boto3_dynamodb.service_resource import DynamoDBServiceResource, Table
from mypy_boto3_s3 import S3ServiceResource, S3Client
from mypy_boto3_s3.service_resource import Bucket


def cognito() -> CognitoIdentityProviderClient:
    return boto3.client('cognito-idp')


def dynamodb() -> DynamoDBServiceResource:
    return boto3.resource('dynamodb')


def s3() -> S3Client:
    return boto3.client('s3')


def s3_resource() -> S3ServiceResource:
    return boto3.resource('s3')


def posts_table() -> Table:
    return dynamodb().Table(os.environ['POSTS_TABLE'])


def comments_table() -> Table:
    return dynamodb().Table(os.environ['COMMENTS_TABLE'])


def uploads_bucket() -> Bucket:
    return s3_resource().Bucket(os.environ['UPLOADS_BUCKET'])


def avatars_bucket() -> Bucket:
    return s3_resource().Bucket(os.environ['AVATARS_BUCKET'])

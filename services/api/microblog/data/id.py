from botocore.exceptions import ClientError

from microblog.utils.clients import posts_table


def get_latest_id() -> int:
    res = posts_table().get_item(
        Key={
            'id': -1
        }
    )
    if not res.get('Item'):
        return 0

    return res['Item']['latestId']


def update_id(new_id) -> int:
    pointer = {
        'id': -1,
        'latestId': new_id
    }
    try:
        posts_table().put_item(
            Item=pointer,
            ReturnConsumedCapacity='TOTAL',
            ConditionExpression='attribute_not_exists(#latestId) OR #latestId < :newId',
            ExpressionAttributeNames={
                '#latestId': 'latestId'
            },
            ExpressionAttributeValues={
                ':newId': new_id
            }
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print(e.response['Error'])
    return new_id

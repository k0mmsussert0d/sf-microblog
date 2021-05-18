import os
from unittest import mock

import pytest
import yaml


@pytest.fixture(autouse=True)
def mock_env_vars():
    with mock.patch.dict(os.environ, {
        'POSTS_TABLE': 'PostsTable',
        'COMMENTS_TABLE': 'CommentsTable',
    }):
        yield


@pytest.fixture(scope='function')
def test_data():
    path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'data.yaml')
    with open(path, 'r') as file:
        yield yaml.load(file, yaml.FullLoader)

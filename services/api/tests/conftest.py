import os
from unittest import mock

import pytest


@pytest.fixture(autouse=True)
def mock_env_vars():
    with mock.patch.dict(os.environ, {
        'POSTS_TABLE': 'PostsTable',
        'COMMENTS_TABLE': 'CommentsTable',
    }):
        yield

class AuthorizationError(Exception):
    def __init__(self, message):
        super().__init__(message)


class NotFoundError(Exception):
    def __init__(self, message):
        super().__init__(message)


class InternalError(Exception):
    def __init__(self, message):
        super().__init__(message)

import orjson
from pydantic import BaseModel as PydanticBaseModel


def _orjson_dumps(val, *, default):
    return orjson.dumps(val, default=default).decode()


class BaseModel(PydanticBaseModel):
    class Config:
        json_loads = orjson.loads
        json_dumps = _orjson_dumps

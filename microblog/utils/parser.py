import base64
import json
from typing import Optional, Union, Dict, Any, Type, TypeVar

from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.utilities.parser import BaseEnvelope

from microblog.models.base_model import BaseModel

Model = TypeVar("Model", bound=BaseModel)


class ApiGatewayProxyV2Envelope(BaseEnvelope):
    def parse(self, data: Optional[Union[Dict[str, Any], Any]], model: Type[Model]) -> Optional[Model]:
        parsed_envelope = APIGatewayProxyEventV2(data)
        if parsed_envelope.is_base64_encoded:
            body = json.loads(base64.b64decode(parsed_envelope.body).decode())
        else:
            body = parsed_envelope.body

        return self._parse(data=body, model=model)

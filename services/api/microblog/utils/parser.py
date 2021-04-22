import base64
import json
from typing import Optional, Union, Dict, Any, Type, TypeVar

from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.utilities.parser import BaseEnvelope
from requests_toolbelt.multipart import decoder

from microblog.models.base_model import BaseModel

Model = TypeVar("Model", bound=BaseModel)


class ApiGatewayProxyV2Envelope(BaseEnvelope):
    def parse(self, data: Optional[Union[Dict[str, Any], Any]], model: Type[Model]) -> Optional[Model]:
        parsed_envelope = APIGatewayProxyEventV2(data)
        content_type = parsed_envelope.headers.get('Content-Type', 'application/json')
        if parsed_envelope.is_base64_encoded:
            body = base64.b64decode(parsed_envelope.body).decode()
            if content_type == 'application/json':
                body = json.loads(body)
            elif content_type == 'multipart/form-data':
                mp_data = decoder.MultipartDecoder(body, 'multipart/form-data')
                body = {}
                for part in mp_data.parts:
                    print(part['headers']['content-disposition'])
        else:
            body = parsed_envelope.body

        return self._parse(data=body, model=model)

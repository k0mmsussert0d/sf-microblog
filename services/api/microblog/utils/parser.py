import base64
import json
from typing import Optional, Union, Dict, Any, Type, TypeVar

from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.utilities.parser import BaseEnvelope
from requests_toolbelt.multipart import decoder

from microblog.models.base_model import BaseModel

Model = TypeVar("Model", bound=BaseModel)
logger = Logger()


class ApiGatewayProxyV2Envelope(BaseEnvelope):
    def parse(self, data: Optional[Union[Dict[str, Any], Any]], model: Type[Model]) -> Optional[Model]:
        parsed_envelope = APIGatewayProxyEventV2(data)
        content_type = parsed_envelope.headers.get('content-type', 'application/json')

        if parsed_envelope.is_base64_encoded:
            body = base64.b64decode(parsed_envelope.body)
        else:
            body = parsed_envelope.body

        if content_type == 'application/json':
            if type(body) == bytes:
                body = body.decode()
            body = json.loads(body)
        elif 'multipart/form-data' in content_type:
            mp_data = decoder.MultipartDecoder(body, content_type)
            body = {}
            for part in mp_data.parts:
                key = self._get_field_name_from_content_disposition_header(part.headers[b'Content-Disposition'])
                if part.headers[b'Content-Type'] == b'application/json':
                    value = json.loads(part.text)
                elif b'image' in part.headers[b'Content-Type']:
                    body['content_type'] = part.headers[b'Content-Type'].decode()
                    value = part.content
                else:
                    value = part.text
                body[key] = value

        return self._parse(data=body, model=model)

    def _get_field_name_from_content_disposition_header(self, header, field_name='name'):
        if type(header) == bytes:
            header = header.decode()

        parts = header.split(';')
        for part in parts:
            if field_name in part:
                return part.split('name=', 1)[1].strip('"')
        return None

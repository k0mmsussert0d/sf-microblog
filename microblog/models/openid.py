from typing import Optional

from aws_lambda_powertools.utilities.parser import Field

from microblog.models.base_model import BaseModel


class OpenIdClaims(BaseModel):
    sub: Optional[str] = Field(None, description='Subject - Identifier for the End-User at the Issuer.')
    name: Optional[str] = Field(None, description='End-User\'s full name in displayable form including all name parts, '
                                                  'possibly including titles and suffixes, ordered according'
                                                  'to the End-User\'s locale and preferences.')
    given_name: Optional[str] = Field(None, description='Given name(s) or first name(s) of the End-User. '
                                                        'Note that in some cultures, people can have multiple'
                                                        ' given names; all can be present, with the names being'
                                                        ' separated by space characters.')
    family_name: Optional[str] = Field(None, description='Surname(s) or last name(s) of the End-User.'
                                                         ' Note that in some cultures, people can have multiple'
                                                         ' family names or no family name; all can be present,'
                                                         ' with the names being separated by space characters.')
    middle_name: Optional[str]
    nickname: Optional[str]
    preferred_username: Optional[str]
    profile: Optional[str]
    picture: Optional[str]
    website: Optional[str]
    email: Optional[str]
    email_verified: Optional[bool]
    gender: Optional[str]
    birthday: Optional[str]
    zoneinfo: Optional[str]
    locale: Optional[str]
    phone_number: Optional[str]
    phone_number_verified: Optional[str]
    address: Optional[dict]
    updated_at: Optional[int]

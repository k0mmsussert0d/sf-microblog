export interface MicroblogConfig {
  apiGateway: {
    REGION: string,
    URL: string
  },
  cognito: {
    REGION: string,
    USER_POOL_ID: string,
    APP_CLIENT_ID: string
  }
}

const Config: MicroblogConfig = {
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://3id07dx535.execute-api.us-east-1.amazonaws.com'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_2h3qESFwH',
    APP_CLIENT_ID: '4mh76tteg9romfiflf0911ir5r'
  }
};

export default Config;

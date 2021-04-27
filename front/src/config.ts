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
    URL: 'https://rmrpwogse3.execute-api.us-east-1.amazonaws.com'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_QOHfMx2ur',
    APP_CLIENT_ID: '5rv1ni1fa3ccsfanme4luck1gc'
  }
};

export default Config;

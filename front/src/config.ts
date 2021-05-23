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
    URL: 'https://23jjkmr7v7.execute-api.us-east-1.amazonaws.com'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_MUlDjptKS',
    APP_CLIENT_ID: '2r2hsq2fq5rmq3hqcq64ovpkj7'
  }
};

export default Config;

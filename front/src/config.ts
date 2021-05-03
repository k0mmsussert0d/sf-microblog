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
    URL: 'https://u40953qlka.execute-api.us-east-1.amazonaws.com'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_i8Vdkm3Ae',
    APP_CLIENT_ID: '2jgprmflb3bpd6ftmn301n377c'
  }
};

export default Config;

export interface Message {
  type: 'success' | 'warning' | 'error' | 'none'
  text?: string
}

export interface SignUpParams {
  username: string;
  password: string;
  attributes?: Record<string, unknown>;
  validationData?: {
    [key: string]: any;
  };
  clientMetadata?: {
    [key: string]: string;
  };
}

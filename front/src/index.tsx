import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Amplify, Auth} from 'aws-amplify';
import Config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: Config.apiGateway.REGION,
    userPoolId: Config.cognito.USER_POOL_ID,
    userPoolWebClientId: Config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: Config.apiGateway.URL,
        region: Config.apiGateway.REGION,
        custom_header: async () => {
          return Auth.currentSession()
            .then(session => {
              return {
                Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
              };
            })
            .catch(() => {
              return {};
            });
        }
        // custom_header: async () => {
        //   return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`};
        // }
      }
    ]
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

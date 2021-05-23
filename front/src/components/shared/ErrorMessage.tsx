import React, {ReactElement} from 'react';
import {Container} from 'rbx';
import {Message as MessageBox} from 'rbx/components/message/message';
import {Message} from '../../models/UI';

const ErrorMessage: React.FC<ErrorMessageProps> = ({msg}: ErrorMessageProps): ReactElement => {

  return (
    <Container breakpoint='desktop'>
      <MessageBox color='danger'>
        <MessageBox.Header>
          <p>Error</p>
        </MessageBox.Header>
        <MessageBox.Body>
          {msg.text}
        </MessageBox.Body>
      </MessageBox>
    </Container>
  );
};

export interface ErrorMessageProps {
  msg: Message
}

export default ErrorMessage;

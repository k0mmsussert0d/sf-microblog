import { Box } from 'rbx';
import React, {ReactElement} from 'react';
import ErrorMessage from '../components/shared/ErrorMessage';

const UnauthenticatedErrorPage: React.FC = (): ReactElement => {

  return (
    <Box>
      <ErrorMessage msg={{
        type: 'error',
        text: 'You must be signed in to access this page'
      }} />
    </Box>
  );
};

export default UnauthenticatedErrorPage;

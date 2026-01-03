import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// If we don't provide a 'variant' (like 'danger' or 'success'), it defaults to 'info' (blue)
Message.defaultProps = {
  variant: 'info',
};

export default Message;
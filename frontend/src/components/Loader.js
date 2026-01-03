import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '50px',   // Slightly smaller for better fit in forms
        height: '50px',
        margin: '20px auto',
        display: 'block',
      }}
    >
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  );
};

export default Loader;
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader'; // Added Loader
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Reset link sent to your email!');
      setEmail(''); // Clear input on success
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      <p className='text-muted'>Enter your email address and we'll send you a link to reset your password.</p>
      
      {isLoading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary' className='mt-3'>
          Send Reset Link
        </Button>
      </Form>

      <div className='py-3'>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          Back to Login
        </Link>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
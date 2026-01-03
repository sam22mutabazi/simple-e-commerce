import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader'; // Added Loader
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
    } else {
      try {
        await resetPassword({ token, password }).unwrap();
        toast.success('Password reset successfully! Please login.');
        navigate('/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      <p className='text-muted'>Please enter your new password below.</p>

      {isLoading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary' className='mt-3'>
          Update Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
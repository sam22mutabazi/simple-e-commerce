import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Set default to Flutterwave for automation
  const [paymentMethod, setPaymentMethod] = useState('Flutterwave');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="my-4">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend' className="fw-bold">Select Method</Form.Label>
          <Col>
            {/* OPTION 1: AUTOMATED */}
            <Form.Check
              type='radio'
              className='my-3 p-3 border rounded'
              label='MTN / Airtel Money (Automated Flutterwave)'
              id='Flutterwave'
              name='paymentMethod'
              value='Flutterwave'
              checked={paymentMethod === 'Flutterwave'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            {/* OPTION 2: MANUAL (WHILE WAITING FOR LIVE KEYS) */}
            <Form.Check
              type='radio'
              className='my-3 p-3 border rounded'
              label='Manual Momo Transfer (Send to 078XXXXXXX)'
              id='Manual'
              name='paymentMethod'
              value='Manual Momo'
              checked={paymentMethod === 'Manual Momo'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              type='radio'
              className='my-3 p-3 border rounded'
              label='Cash on Delivery'
              id='Cash'
              name='paymentMethod'
              value='Cash'
              checked={paymentMethod === 'Cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3 w-100 py-2 fw-bold'>
          Continue to Order Review
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
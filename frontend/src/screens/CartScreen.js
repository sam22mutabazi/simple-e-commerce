import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Button, Card, Form } from 'react-bootstrap'; // Added Form
import { removeFromCart, addToCart } from '../slices/cartSlice'; // Added addToCart

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Check if the user is logged in from the auth state
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      // If not logged in, go to login then redirect to shipping
      navigate('/login?redirect=/shipping');
    } else {
      // If already logged in, go straight to shipping
      navigate('/shipping');
    }
  };

  return (
    <Row>
      <Col md={8}>
        <h1 className="mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className='alert alert-info'>
            Your cart is empty. <Link to='/'>Go Back</Link>
          </div>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id} className="py-3">
                <Row className='align-items-center'>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`} className="fw-bold">{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    {/* Quantity Selector: Allows changing qty directly in cart */}
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <i className='fas fa-trash text-danger'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="shadow-sm">
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>
                Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) items
              </h3>
              <p className='h4 text-primary'>
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block w-100 py-2'
                variant='dark'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
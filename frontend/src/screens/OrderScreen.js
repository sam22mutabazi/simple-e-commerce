import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { 
  useGetOrderDetailsQuery, 
  useVerifyMomoTokenMutation, 
  usePayOrderManualMutation, // Added this
  useDeliverOrderMutation 
} from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  
  const [verifyMomoToken, { isLoading: loadingVerify }] = useVerifyMomoTokenMutation();
  const [payOrderManual, { isLoading: loadingPay }] = usePayOrderManualMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const formatRWF = (num) => {
    return Number(num).toLocaleString('en-RW');
  };

  useEffect(() => {
    if (order?.isPaid && !userInfo.isAdmin) {
      const timeout = setTimeout(() => navigate('/payment-success'), 5000);
      return () => clearTimeout(timeout);
    }
  }, [order?.isPaid, navigate, userInfo.isAdmin]);

  const printHandler = () => window.print();

  // Handler for Admin to manually confirm payment
  const payHandler = async () => {
    try {
      await payOrderManual(orderId).unwrap();
      refetch();
      toast.success('Order marked as paid');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Handler for Admin to mark as delivered
  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleFlutterwavePayment = () => {
    if (!window.FlutterwaveCheckout) {
      toast.error('Payment system loading. Please refresh.');
      return;
    }

    window.FlutterwaveCheckout({
      public_key: process.env.REACT_APP_FLW_PUBLIC_KEY || "FLWPUBK_TEST-800201dd27f98dee0ad1f5dbdfaca980-X", 
      tx_ref: `RW-MOMO-${order._id}-${Date.now()}`,
      amount: order.totalPrice, 
      currency: "RWF",
      payment_options: "mobilemoneyrwanda, card",
      customer: { 
        email: userInfo.email, 
        name: userInfo.name,
      },
      customizations: {
        title: "Store Checkout",
        description: `Order #${order._id.slice(-6)}`,
        logo: "https://cdn-icons-png.flaticon.com/512/9452/9452276.png",
      },
      callback: async (data) => {
        if (data.status === "successful") {
          try {
            await verifyMomoToken({ 
              id: orderId, 
              flw_ref: String(data.transaction_id || data.id) 
            }).unwrap();
            toast.success('Payment Verified!');
            refetch(); 
          } catch (err) { 
            toast.error(err?.data?.message || 'Verification failed.'); 
          }
        }
      },
    });
  };

  return isLoading ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
    <>
      <div className="d-flex justify-content-between align-items-center my-3 no-print">
        <h1 style={{ fontSize: '1.2rem' }}>Order #{order._id}</h1>
        <Button variant='dark' onClick={printHandler} size="sm">
          <i className='fas fa-print me-2'></i> Print Invoice
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p><strong>Name: </strong> {order.user.name}</p>
              <p><strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
              {order.isDelivered ? (
                <Message variant='success'>Delivered on {new Date(order.deliveredAt).toLocaleString()}</Message>
              ) : (
                <Message variant='warning'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment</h3>
              <p><strong>Method: </strong> {order.paymentMethod}</p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {new Date(order.paidAt).toLocaleString()}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
              
              {/* Show Manual Instructions if customer selected Manual Momo */}
              {!order.isPaid && order.paymentMethod === 'Manual Momo' && (
                <div className='p-3 border rounded bg-light'>
                   <strong>Instructions:</strong> Please send <strong>{formatRWF(order.totalPrice)} RWF</strong> to 
                   <span className='text-primary'> 078XXXXXXX</span>. Use Order ID as reason.
                </div>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Items</h3>
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                      <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                      <Col md={4} className="text-end">{item.qty} x {formatRWF(item.price)} = <strong>{formatRWF(item.qty * item.price)} RWF</strong></Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0">
            <ListGroup variant='flush'>
              <ListGroup.Item className="bg-light"><h2>Summary</h2></ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Items</Col><Col className="text-end">{formatRWF(order.itemsPrice)} RWF</Col></Row>
                <Row><Col>Shipping</Col><Col className="text-end">{formatRWF(order.shippingPrice)} RWF</Col></Row>
                <hr />
                <Row>
                    <Col><strong>Total</strong></Col>
                    <Col className="text-end"><strong>{formatRWF(order.totalPrice)} RWF</strong></Col>
                </Row>
              </ListGroup.Item>

              {/* PAYMENT BUTTON (For Customers) */}
              {!order.isPaid && !userInfo.isAdmin && (
                <ListGroup.Item className="no-print">
                  {order.paymentMethod === 'Flutterwave' ? (
                    <Button 
                      type='button' className='btn-block w-100 py-3 fw-bold' 
                      onClick={handleFlutterwavePayment} disabled={loadingVerify}
                      style={{ backgroundColor: '#ffcc00', color: '#000', border: 'none', borderRadius: '10px' }}
                    >
                      PAY WITH MOMO / CARD
                    </Button>
                  ) : (
                    <Message variant='info'>Follow instructions above to pay manually.</Message>
                  )}
                </ListGroup.Item>
              )}

              {/* ADMIN ACTION: MARK AS PAID */}
              {userInfo && userInfo.isAdmin && !order.isPaid && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block w-100' onClick={payHandler} disabled={loadingPay}>
                    Mark As Paid (Confirm Received)
                  </Button>
                </ListGroup.Item>
              )}

              {/* ADMIN ACTION: MARK AS DELIVERED */}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block w-100' onClick={deliverHandler} disabled={loadingDeliver}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
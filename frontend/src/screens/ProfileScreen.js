import React from 'react';
import { Table, Button, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <Row>
      <Col md={3}>
        <h2 className='mb-4'>User Profile</h2>
        <Card className='p-3 shadow-sm'>
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
        </Card>
      </Col>

      <Col md={9}>
        <h2 className='mb-4'>My Order History</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className='alert alert-danger'>{error.data?.message || error.error}</div>
        ) : orders && orders.length === 0 ? (
          <div className='alert alert-info'>You have no orders yet. <LinkContainer to='/'><a>Go Shopping</a></LinkContainer></div>
        ) : (
          <Table striped hover responsive className='table-sm shadow-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className='text-success'><i className='fas fa-check'></i> {order.paidAt.substring(0, 10)}</span>
                    ) : (
                      <span className='text-danger'><i className='fas fa-times'></i> No</span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className='text-success'><i className='fas fa-check'></i> {order.deliveredAt.substring(0, 10)}</span>
                    ) : (
                      <span className='text-danger'><i className='fas fa-times'></i> Pending</span>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='dark'>Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
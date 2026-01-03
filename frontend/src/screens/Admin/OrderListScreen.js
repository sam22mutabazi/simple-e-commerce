import React from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <Container>
      <h1 className='my-4'>Customer Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error.data?.message || error.error || 'Failed to fetch orders'}
        </Message>
      ) : (
        <Table striped hover responsive className='table-sm shadow-sm'>
          <thead className='bg-light'>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}...</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                <td>
                  {order.isPaid ? (
                    <span className='text-success'>
                      <i className='fas fa-check'></i> {order.paidAt?.substring(0, 10)}
                    </span>
                  ) : (
                    <span className='text-danger'>
                      <i className='fas fa-times'></i> Not Paid
                    </span>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span className='text-success'>
                      <i className='fas fa-check'></i> {order.deliveredAt?.substring(0, 10)}
                    </span>
                  ) : (
                    <span className='text-danger'>
                      <i className='fas fa-times'></i> Pending
                    </span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='dark' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderListScreen;
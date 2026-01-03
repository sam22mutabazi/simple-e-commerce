import React from 'react';
import { Table, Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetLowStockProductsQuery } from '../../slices/productsApiSlice';
import Loader from '../Loader';

const LowStockWidget = () => {
  const { data: products, isLoading, error } = useGetLowStockProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return null;

  return (
    <Card className='shadow-sm border-0'>
      <Card.Header className='bg-white py-3'>
        <h5 className='mb-0 text-danger'><i className='fas fa-exclamation-triangle'></i> Low Stock Alerts</h5>
      </Card.Header>
      <Card.Body>
        {products.length === 0 ? (
          <p className='text-muted'>All items are well stocked! ✅</p>
        ) : (
          <Table responsive hover className='align-middle'>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    <Badge bg={product.countInStock === 0 ? 'danger' : 'warning'} text='dark'>
                      {product.countInStock} left
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/admin/product/${product._id}/edit`} className='btn btn-sm btn-light'>
                      Restock
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default LowStockWidget;
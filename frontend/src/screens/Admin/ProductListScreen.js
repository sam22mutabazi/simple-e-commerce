import React from 'react';
import { Table, Button, Row, Col, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
    useGetAdminProductsQuery, 
    useCreateProductMutation, 
    useDeleteProductMutation 
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  // Fetching ALL products using the new admin-specific query
  const { data: products, isLoading, error, refetch } = useGetAdminProductsQuery();

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Create a new sample product?')) {
      try {
        await createProduct().unwrap();
        toast.success('Sample product created. Click edit to change details.');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Inventory Management ({products ? products.length : 0})</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3 btn-primary' onClick={createProductHandler} disabled={loadingCreate}>
            <i className='fas fa-plus'></i> Add Product
          </Button>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && <Spinner animation="border" className='d-block mx-auto my-2' />}

      {isLoading ? (
        <Spinner animation="border" className='d-block mx-auto' />
      ) : error ? (
        <div className='alert alert-danger'>{error.data?.message || 'Error loading inventory'}</div>
      ) : (
        <Table striped hover responsive className='table-sm shadow-sm'>
          <thead className='bg-light'>
            <tr>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>STOCK STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {/* Maps directly over the array returned by the admin endpoint */}
            {products?.map((product) => (
              <tr key={product._id}>
                <td><strong>{product.name}</strong></td>
                <td>RWF {product.price.toLocaleString()}</td>
                <td>{product.category}</td>
                <td>
                  {product.countInStock === 0 ? (
                    <span className='badge bg-danger'>Out of Stock</span>
                  ) : product.countInStock <= 5 ? (
                    <span className='badge bg-warning text-dark'>Low: {product.countInStock}</span>
                  ) : (
                    <span className='badge bg-success'>{product.countInStock} Available</span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm text-white' onClick={() => deleteHandler(product._id)}>
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
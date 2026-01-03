import React from 'react';
import { ListGroup, Badge, Spinner } from 'react-bootstrap';
import { useGetCategoryListQuery } from '../slices/productsApiSlice';

const CategorySidebar = ({ setCategory, selectedCategory }) => {
  // Use the new hook we created in productsApiSlice
  const { data: categories, isLoading, error } = useGetCategoryListQuery();

  if (isLoading) return <Spinner animation="border" size="sm" />;
  if (error) return null;

  return (
    <div className="mb-4">
      <h4 className="mb-3">Categories</h4>
      <ListGroup variant="flush" className="border rounded shadow-sm">
        {/* Manual 'All' Item */}
        <ListGroup.Item
          action
          active={selectedCategory === ''}
          onClick={() => setCategory('')}
          className="py-3 d-flex justify-content-between align-items-center"
          style={{ cursor: 'pointer' }}
        >
          All Products
        </ListGroup.Item>

        {/* Dynamic Items from Database */}
        {categories.map((c) => {
          const isActive = c.name === selectedCategory;

          return (
            <ListGroup.Item
              key={c.name}
              action
              active={isActive}
              onClick={() => setCategory(c.name)}
              className="py-3 d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal' }}
            >
              {c.name}
              {/* Show the count of products in this category */}
              <Badge bg={isActive ? 'light' : 'primary'} text={isActive ? 'dark' : 'white'} pill>
                {c.count}
              </Badge>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default CategorySidebar;
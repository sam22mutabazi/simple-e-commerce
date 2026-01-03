import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import CategorySidebar from '../components/CategorySidebar';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const { keyword, pageNumber = 1 } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(
          `/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber}&category=${encodeURIComponent(selectedCategory)}`,
          { signal: controller.signal }
        );

        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [keyword, pageNumber, selectedCategory]);

  return (
    <>
      <Row>
        <Col md={3}>
          <div className="category-sidebar-container">
            <CategorySidebar 
              setCategory={setSelectedCategory} 
              selectedCategory={selectedCategory} 
            />
          </div>
        </Col>

        <Col md={9}>
          <h1 className="mb-4">
            {selectedCategory ? `Category: ${selectedCategory}` : keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
          </h1>
          
          {loading ? (
            <p>Loading...</p> 
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {products.length === 0 && (
                <div className="alert alert-info">No products found.</div>
              )}
              {/* FIXED: Added g-4 for consistent spacing */}
              <Row className="g-4"> 
                {products.map((product) => (
                  // FIXED: Added d-flex to ensure columns stretch equally
                  <Col key={product._id} sm={12} md={6} lg={4} className="d-flex align-items-stretch">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>

              <div className="mt-4">
                <Paginate 
                  pages={pages} 
                  page={page} 
                  keyword={keyword ? keyword : ''} 
                  category={selectedCategory} 
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
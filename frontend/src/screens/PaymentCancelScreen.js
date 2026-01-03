import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';

const PaymentCancelScreen = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card className="p-5 shadow-lg text-center" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <div style={{ color: '#dc3545', fontSize: '80px', marginBottom: '20px' }}>
          <i className="fas fa-times-circle"></i>
        </div>
        
        <h1 className="mb-3" style={{ fontWeight: 'bold' }}>Payment Cancelled</h1>
        <p className="text-muted mb-4">
          It looks like the transaction was cancelled or timed out. Don't worry—your items are still in your cart (or saved in your order), and no money was deducted.
        </p>

        <div className="d-grid gap-2">
          <Link to="/profile">
            <Button variant="danger" className="w-100 py-2 mb-2">
              Try Payment Again
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline-secondary" className="w-100 py-2">
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 small text-muted">
          Need help? Contact our support team if you're having trouble with MoMo.
        </div>
      </Card>
    </Container>
  );
};

export default PaymentCancelScreen;
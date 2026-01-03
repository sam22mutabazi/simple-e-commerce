import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';

const PaymentSuccessScreen = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card className="p-5 shadow-lg text-center" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <div style={{ color: '#28a745', fontSize: '80px', marginBottom: '20px' }}>
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1 className="mb-3" style={{ fontWeight: 'bold' }}>Payment Successful!</h1>
        <p className="text-muted mb-4">
          Thank you for your purchase! Your payment has been verified and your order is now being prepared for delivery.
        </p>

        <div className="d-grid gap-2">
          <Link to="/profile">
            <Button variant="success" className="w-100 py-2 mb-2">
              <i className="fas fa-list-ul mr-2"></i> View My Orders
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline-secondary" className="w-100 py-2">
              Continue Shopping
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 small text-muted">
          A confirmation email will be sent to you shortly.
        </div>
      </Card>
    </Container>
  );
};

export default PaymentSuccessScreen;
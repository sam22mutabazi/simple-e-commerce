import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-dark text-white mt-5'>
      <Container>
        <Row className='py-5'>
          {/* Column 1: About */}
          <Col md={4} className='mb-4 mb-md-0'>
            <h5 className='text-uppercase mb-3 fw-bold'>MS Electronic SimpleShop</h5>
            <p className='text-secondary small'>
              Your one-stop shop for premium iPhone cases, chargers, and high-quality electronics. We provide the best gear for your tech lifestyle.
            </p>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={4} className='mb-4 mb-md-0 text-md-center'>
            <h5 className='text-uppercase mb-3 fw-bold'>Quick Links</h5>
            <ul className='list-unstyled'>
              <li className='mb-2'>
                <a href="/" className='text-secondary text-decoration-none'>Home</a>
              </li>
              <li className='mb-2'>
                <a href="/cart" className='text-secondary text-decoration-none'>Cart</a>
              </li>
              <li className='mb-2'>
                <a href="/login" className='text-secondary text-decoration-none'>Login</a>
              </li>
            </ul>
          </Col>

          {/* Column 3: Contact & Social */}
          <Col md={4} className='text-md-end'>
            <h5 className='text-uppercase mb-3 fw-bold'>Follow &Contact Us</h5>
            <div className="social-icons">
              {/* Changed href='#' to actual external links or javascript:void(0) */}
              <a href="https://www.facebook.com/share/1AofapwKx5/" target="_blank" rel="noreferrer" className='text-white me-3'>
                <i className='fab fa-facebook fa-lg'></i>
              </a>
              <a href="https://whatsapp.com/channel/0029VbBuZJmKWEKxZ63xS51J" target="_blank" rel="noreferrer" className='text-white me-3'>
                <i className='fab fa-whatsapp fa-lg'></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className='text-white me-3'>
                <i className='fab fa-twitter fa-lg'></i>
              </a>
            </div>
            <p className='text-secondary mt-3 small'>
              Email:samumutabazi@gmail.com
            </p>
          </Col>
        </Row>

        <hr className='border-secondary' />

        <Row>
          <Col className='text-center py-3 text-secondary'>
            <small>MS Electronic SimpleShop &copy; {currentYear} | All Rights Reserved</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
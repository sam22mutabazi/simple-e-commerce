import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Layout & Screens
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; 
import AdminRoute from './components/AdminRoute'; 
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import PaymentCancelScreen from './screens/PaymentCancelScreen';
import AdminDashboardScreen from './screens/Admin/AdminDashboardScreen';
import OrderListScreen from './screens/Admin/OrderListScreen'; 
import ProductListScreen from './screens/Admin/ProductListScreen';
import ProductEditScreen from './screens/Admin/ProductEditScreen'; 
import UserListScreen from './screens/Admin/UserListScreen'; 
import UserEditScreen from './screens/Admin/UserEditScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/search/:keyword' element={<HomeScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
            
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
            <Route path='/reset-password/:token' element={<ResetPasswordScreen />} />

            {/* Private User Routes */}
            <Route path='' element={<PrivateRoute />}>
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/order/:id' element={<OrderScreen />} />
              <Route path='/payment-success' element={<PaymentSuccessScreen />} />
              <Route path='/payment-cancel' element={<PaymentCancelScreen />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route path='' element={<AdminRoute />}>
              <Route path='/admin/dashboard' element={<AdminDashboardScreen />} />
              <Route path='/admin/orderlist' element={<OrderListScreen />} />
              <Route path='/admin/productlist' element={<ProductListScreen />} />
              <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
              <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
              <Route path='/admin/userlist' element={<UserListScreen />} /> 
              {/* CRITICAL: Ensure this matches the navigate path in UserListScreen */}
              <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
            </Route>
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer autoClose={3000} /> 
    </Router>
  );
};

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'; // Standard for ProShop/E-commerce projects
import store from './store';
import './index.css';
import 'react-toastify/dist/ReactToastify.css'; // Ensure Toast CSS is loaded at the top level
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
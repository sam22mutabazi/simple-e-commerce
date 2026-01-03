import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 'credentials: include' allows the frontend to send the JWT cookie 
// stored in the browser back to the server for protected routes.
const baseQuery = fetchBaseQuery({ 
    baseUrl: '',
    credentials: 'include', 
});

export const apiSlice = createApi({
  baseQuery,
  // Added 'Products' to handle the 9-item grid refresh independently of single product details
  tagTypes: ['Product', 'Order', 'User', 'Products'],
  endpoints: (builder) => ({}),
});
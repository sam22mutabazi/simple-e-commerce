import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({ url: ORDERS_URL, method: 'POST', body: { ...order } }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({ url: `${ORDERS_URL}/${id}` }),
      providesTags: ['Order'],
    }),
    verifyMomoToken: builder.mutation({
      query: ({ id, flw_ref }) => ({ 
        url: `${ORDERS_URL}/${id}/verify-momo`, 
        method: 'POST', 
        body: { flw_ref } 
      }),
      invalidatesTags: ['Order'],
    }),
    // --- NEW: Admin Manual Payment Mutation ---
    payOrderManual: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-manual`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order', 'Product'], // Invalidates product to refresh stock counts
    }),
    getMyOrders: builder.query({ 
        query: () => ({ url: `${ORDERS_URL}/mine` }), 
        providesTags: ['Order'] 
    }),
    getOrders: builder.query({ 
        query: () => ({ url: ORDERS_URL }), 
        providesTags: ['Order'] 
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}/deliver`, method: 'PUT' }),
      invalidatesTags: ['Order'],
    }),
    // --- Dashboard Analytics ---
    getSummary: builder.query({ 
        query: () => ({ url: `${ORDERS_URL}/summary` }), 
        keepUnusedDataFor: 5,
        providesTags: ['Order'] 
    }),
    getSalesData: builder.query({ 
        query: () => ({ url: `${ORDERS_URL}/sales-data` }), 
        providesTags: ['Order'] 
    }),
    getTopProducts: builder.query({ 
        query: () => ({ url: `${ORDERS_URL}/top-products` }), 
        providesTags: ['Order'] 
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  useVerifyMomoTokenMutation, 
  usePayOrderManualMutation, // Exported new hook
  useGetMyOrdersQuery, 
  useGetOrdersQuery, 
  useDeliverOrderMutation,
  useGetSummaryQuery, 
  useGetSalesDataQuery, 
  useGetTopProductsQuery 
} = ordersApiSlice;
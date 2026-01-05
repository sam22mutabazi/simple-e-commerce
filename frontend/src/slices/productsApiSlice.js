import { apiSlice } from './apiSlice';
const PRODUCTS_URL = '/api/products';
const UPLOAD_URL = '/api/upload';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber, category },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),

    getAdminProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/admin`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),

    getCategoryList: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),

    getLowStockProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/lowstock`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products', 'Product'],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAdminProductsQuery,
  useGetCategoryListQuery,
  useGetLowStockProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productsApiSlice;
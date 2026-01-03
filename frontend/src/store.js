import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice'; // Import your base apiSlice
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  // Add the api middleware to enable caching, invalidation, polling, and other features of RTK-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
import { createSlice } from '@reduxjs/toolkit';

// Helper function to handle rounding for RWF (Whole numbers)
const addDecimals = (num) => {
  return Math.round(num).toString(); 
};

const updateCart = (state) => {
  // 1. Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // 2. Shipping price (Free over 20,000 RWF, else 2,000 RWF)
  const shippingPrice = itemsPrice > 20000 ? 0 : 2000;
  state.shippingPrice = addDecimals(shippingPrice);

  // 3. Tax price (18% VAT for Rwanda)
  const taxPrice = 0.18 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // 4. Total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'MTN / Airtel Money' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
// Helper to round to whole numbers for RWF
export const addDecimals = (num) => {
  return Math.round(num).toString();
};

export const updateCart = (state) => {
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

  // Save the entire cart state to local storage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
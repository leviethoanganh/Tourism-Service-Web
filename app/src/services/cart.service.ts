import axios from 'axios';
import { CartItem } from '../types';

export const cartService = {
  render: (cart: CartItem[]) =>
    axios.post('/cart/render', { cart }).then(r => r.data),
};

import { CartItem } from './cart-item';
import { Usuario } from '../auth/usuario';

export class Cart {
  id!: number;
  usuario!: Usuario;
  items: CartItem[] = [];
  totalPrice!: number;
}

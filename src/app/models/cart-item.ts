import { Acessory } from './acessory';
import { Car } from './car';
import { Cart } from './cart';

export class CartItem {
  id!: number;
  cart!: Cart;
  car!: Car;
  calculatedPrice: number = 0;
  chosenAccessories: Acessory[] = [];
}

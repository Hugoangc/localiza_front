import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { CartItemRequestDTO } from '../models/cart-item-request.dto';
import { CartItem } from '../models/cart-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  API = environment.SERVIDOR + '/api/cart';

  addToCart(requestBody: CartItemRequestDTO): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.API}/add`, requestBody);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API);
  }

  updateCartItem(itemId: number, requestBody: CartItemRequestDTO): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.API}/item/${itemId}`, requestBody);
  }

  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/remove/${itemId}`);
  }
  clearCart() {
    return this.http.delete(`${this.API}/clear`);
  }
}

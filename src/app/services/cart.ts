import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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

  private cartUpdatedSubject = new BehaviorSubject<void>(undefined);
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  addToCart(requestBody: CartItemRequestDTO): Observable<CartItem> {
    const result = this.http.post<CartItem>(`${this.API}/add`, requestBody);
    result.subscribe(() => this.cartUpdatedSubject.next());
    return result;
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API);
  }

  updateCartItem(itemId: number, requestBody: CartItemRequestDTO): Observable<CartItem> {
    const result = this.http.put<CartItem>(`${this.API}/item/${itemId}`, requestBody);
    result.subscribe(() => this.cartUpdatedSubject.next());
    return result;
  }

  removeFromCart(itemId: number): Observable<void> {
    const result = this.http.delete<void>(`${this.API}/remove/${itemId}`);
    result.subscribe(() => this.cartUpdatedSubject.next());
    return result;
  }

  clearCart(): Observable<void> {
    const result = this.http.delete<void>(`${this.API}/clear`);
    result.subscribe(() => this.cartUpdatedSubject.next());
    return result;
  }

  notifyCartUpdated(): void {
    this.cartUpdatedSubject.next();
  }
}

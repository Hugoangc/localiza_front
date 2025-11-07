import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';
import { PaymentRequestDTO } from '../models/payment-request.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  API = environment.SERVIDOR + '/api/orders';

  submitCheckout(paymentDetails: PaymentRequestDTO): Observable<Order> {
    return this.http.post<Order>(`${this.API}/checkout`, paymentDetails);
  }
}

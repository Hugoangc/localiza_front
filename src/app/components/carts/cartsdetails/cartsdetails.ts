import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../../models/car';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CartService } from '../../../services/cart'; // ✅ IMPORTANTE
import { CartItemRequestDTO } from '../../../models/cart-item-request.dto';

@Component({
  selector: 'app-cartsdetails',
  standalone: true,
  imports: [CommonModule, MdbFormsModule],
  templateUrl: './cartsdetails.html',
  styleUrls: ['./cartsdetails.scss'],
})
export class Cartsdetails {
  @Input() car!: Car;
  @Output() return = new EventEmitter<'goToCart' | 'continue'>();
  // modalRef!: MdbModalRef<any>;
  modalService = inject(MdbModalService);
  modalRef: any;
  router = inject(Router);
  cartService = inject(CartService);

  continueShopping(): void {
    this.return.emit('continue');
  }

  addToCart(): void {
    if (!this.car?.id) {
      Swal.fire('Error', 'Invalid car information.', 'error');
      return;
    }

    const request: CartItemRequestDTO = {
      carId: this.car.id,
      accessoryIds: [],
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        Swal.fire('Added!', `${this.car.name} was added to your cart.`, 'success');
        this.return.emit('continue');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Unable to add the car to cart.', 'error');
      },
    });
  }
  openDetails(car: Car) {
    this.modalRef = this.modalService.open(Cartsdetails, {
      data: { car },
    });
    this.modalRef.componentInstance.modalRef = this.modalRef;
  }
  addAndGoToCart(): void {
    if (!this.car?.id) {
      Swal.fire('Error', 'Invalid car information.', 'error');
      return;
    }

    const request: CartItemRequestDTO = {
      carId: this.car.id,
      accessoryIds: [],
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        Swal.fire('Added!', `${this.car.name} was added to your cart.`, 'success').then(() => {
          this.return.emit('goToCart');
          this.router.navigate(['/admin/cart']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Unable to add the car to cart.', 'error');
      },
    });
  }
}

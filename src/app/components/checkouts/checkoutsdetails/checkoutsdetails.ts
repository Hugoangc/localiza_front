import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/order';

@Component({
  selector: 'app-checkoutsdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkoutsdetails.html',
  styleUrls: ['./checkoutsdetails.scss'],
})
export class Checkoutsdetails {
  orderService = inject(OrderService);
  router = inject(Router);
  fb = inject(FormBuilder);

  @Input() modeModal: boolean = false;
  @Input() hiddenButtons: boolean = false;
  @Output() return = new EventEmitter<void>();
  paymentForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(5)]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{16}$/)], // 16 dígitos
      ],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)], // MM/AA
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      saveCard: [false],
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    Swal.fire({
      title: 'Processando pagamento...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    const paymentDetails = this.paymentForm.value;

    this.orderService.submitCheckout(paymentDetails).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        Swal.close();
        Swal.fire({
          title: 'Pagamento Aprovado!',
          text: `Seu pedido #${order.id} foi criado com sucesso.`,
          icon: 'success',
        });
        this.return.emit();
        this.router.navigate(['/admin/cars']);
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.close();
        Swal.fire({
          title: 'Erro no Pagamento',
          text: err.error || 'Erro inesperado.',
          icon: 'error',
        });
      },
    });
  }
}

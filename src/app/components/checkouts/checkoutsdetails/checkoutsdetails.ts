import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { OrderService } from '../../../services/order';
import { PaymentRequestDTO } from '../../../models/payment-request.dto';

@Component({
  selector: 'app-checkoutsdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbFormsModule, FormsModule],
  templateUrl: './checkoutsdetails.html',
  styleUrls: ['./checkoutsdetails.scss'],
})
export class Checkoutsdetails implements OnInit {
  paymentForm!: FormGroup;
  isSubmitting = false;

  @Output('return') return = new EventEmitter<any>();
  @Input('modeModal') modeModal: boolean = false;
  @Input('hiddenButtons') hiddenButtons: boolean = false;

  fb = inject(FormBuilder);
  orderService = inject(OrderService);
  router = inject(Router);

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(5)]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/(2[5-9]|3[0-9])$')],
      ], // aceita 25-39
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false],
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      Swal.fire('Formulário Inválido', 'Verifique os dados do cartão.', 'warning');
      return;
    }

    this.isSubmitting = true;
    const paymentDetails: PaymentRequestDTO = {
      cardNumber: this.paymentForm.value.cardNumber.replace(/\s/g, ''),
      cardHolderName: this.paymentForm.value.cardHolderName,
      expiryDate: this.paymentForm.value.expiryDate,
      cvv: this.paymentForm.value.cvv,
      saveCard: this.paymentForm.value.saveCard,
    };

    this.orderService.submitCheckout(paymentDetails).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        Swal.fire(
          'Compra Realizada!',
          `Seu pedido #${order.id} foi processado com sucesso.`,
          'success'
        );
        this.return.emit(order);
      },
      error: (err) => {
        this.isSubmitting = false;
        const erroMsg =
          err.error?.message || err.message || 'Não foi possível processar seu pagamento.';
        Swal.fire('Pagamento Falhou', erroMsg, 'error');
      },
    });
  }
}

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
  ReactiveFormsModule, // Necessário para Reactive Forms
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, etc.
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { OrderService } from '../../../services/order'; // Verifique o caminho
import { PaymentRequestDTO } from '../../../models/payment-request.dto'; // Verifique o caminho

@Component({
  selector: 'app-checkoutsdetails', // Seguindo seu padrão de nomenclatura
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbFormsModule, FormsModule],
  templateUrl: './checkoutsdetails.html',
  styleUrl: './checkoutsdetails.scss',
})
export class Checkoutsdetails implements OnInit {
  paymentForm!: FormGroup;
  isSubmitting = false;
  @Output('return') return = new EventEmitter<any>();
  @ViewChild('modalAcessoriesDetails') modalAcessoriesDetails!: TemplateRef<any>;
  modalRef: any;

  //@ViewChild('modalAcessoriesDetails') modalAcessoriesDetails!: TemplateRef<any>; // referencia da modal
  @Input('modeModal') modeModal: boolean = false;
  @Input('hiddenButtons') hiddenButtons: boolean = false;

  fb = inject(FormBuilder);
  orderService = inject(OrderService);
  router = inject(Router);
  @ViewChild('modalCheckoutsdetails') modalCheckoutsdetails!: TemplateRef<any>; // referencia da modal

  ngOnInit(): void {
    // Validação de front-end
    this.paymentForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$')]], // MM/AA
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
    const paymentDetails: PaymentRequestDTO = this.paymentForm.value;

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

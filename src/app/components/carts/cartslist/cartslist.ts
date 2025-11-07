import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';
import { CartService } from '../../../services/cart'; // Verifique o caminho
import { CartItem } from '../../../models/cart-item'; // Verifique o caminho
import { CartItemRequestDTO } from '../../../models/cart-item-request.dto'; // Verifique o caminho
import { Cart } from '../../../models/cart'; // Verifique o caminho

@Component({
  selector: 'app-cartslist',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, CommonModule],
  templateUrl: './cartslist.html',
  styleUrls: ['./cartslist.scss'],
})
export class Cartslist implements OnInit {
  cart: Cart | null = null;
  isLoading = true;

  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar carrinho', err);
        this.isLoading = false;
        Swal.fire('Erro!', 'Não foi possível carregar o carrinho.', 'error');
      },
    });
  }

  removeItem(item: CartItem): void {
    Swal.fire({
      title: 'Remover Item',
      text: `Deseja remover ${item.car.name} do carrinho?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(item.id).subscribe({
          next: () => {
            Swal.fire('Removido!', 'Item removido do carrinho.', 'success');
            this.loadCart(); // Recarrega o carrinho
          },
          error: (err) => {
            Swal.fire('Erro!', 'Não foi possível remover o item.', 'error');
          },
        });
      }
    });
  }

  editAccessories(item: CartItem): void {
    const car = item.car;
    const currentlyChosenIds = item.chosenAccessories.map((acc) => acc.id);

    let accessoryHtml = '';
    if (car.acessories && car.acessories.length > 0) {
      accessoryHtml = '<div style="text-align: left; margin-top: 15px;">';
      car.acessories.forEach((acc) => {
        const isChecked = currentlyChosenIds.includes(acc.id);
        accessoryHtml += `
          <div class="swal2-checkbox" style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type="checkbox" class="swal2-input" value="${acc.id}" id="acc-${acc.id}" ${
          isChecked ? 'checked' : ''
        }>
            <label for="acc-${acc.id}" style="margin-left: 10px; cursor: pointer;">
              ${acc.name} (+ $${acc.price.toFixed(2)})
            </label>
          </div>
        `;
      });
      accessoryHtml += '</div>';
    } else {
      accessoryHtml = '<p>Este carro não possui acessórios.</p>';
    }

    Swal.fire({
      title: `Editar ${car.name}`,
      html: accessoryHtml,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Atualizar Item',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const selectedAccessoryIds: number[] = [];
        const checkboxes = document.querySelectorAll(
          '.swal2-checkbox input[type=checkbox]:checked'
        );
        checkboxes.forEach((checkbox) => {
          selectedAccessoryIds.push(Number((checkbox as HTMLInputElement).value));
        });
        return selectedAccessoryIds;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedIds = result.value as number[];
        const request: CartItemRequestDTO = {
          carId: car.id,
          accessoryIds: selectedIds,
        };

        this.cartService.updateCartItem(item.id, request).subscribe({
          next: (updatedItem) => {
            Swal.fire(
              'Atualizado!',
              `Preço atualizado para $${updatedItem.calculatedPrice.toFixed(2)}`,
              'success'
            );
            this.loadCart();
          },
          error: (err) => {
            Swal.fire('Erro!', 'Não foi possível atualizar o item.', 'error');
          },
        });
      }
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/admin/checkout']);
  }

  goToHome(): void {
    this.router.navigate(['/admin/cars']);
  }
}

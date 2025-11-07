// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   OnInit,
//   inject,
//   ViewChild,
//   TemplateRef,
//   Output,
//   EventEmitter,
//   input,
//   Input,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
// import { MdbModalService, MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
// import Swal from 'sweetalert2';
// import { CartService } from '../../../services/cart';
// import { CartItem } from '../../../models/cart-item';
// import { CartItemRequestDTO } from '../../../models/cart-item-request.dto';
// import { Cart } from '../../../models/cart';
// import { Acessory } from '../../../models/acessory';
// import { Checkoutsdetails } from '../../checkouts/checkoutsdetails/checkoutsdetails';
// @Component({
//   selector: 'app-cartslist',
//   standalone: true,
//   imports: [MdbFormsModule, FormsModule, CommonModule, MdbModalModule, Checkoutsdetails],
//   templateUrl: './cartslist.html',
//   styleUrls: ['./cartslist.scss'],
// })
// export class Cartslist implements OnInit {
//   isLoading = true;
//   @Output('return') return = new EventEmitter<any>();

//   @Input('cart') cart!: Cart;
//   @ViewChild('modalCheckoutsdetails') modalCheckoutsdetails!: TemplateRef<any>;
//   @ViewChild('modalEditAccessories') modalEditAccessories!: TemplateRef<any>;

//   modalService = inject(MdbModalService);
//   modalRef: any;

//   editingItem: CartItem | null = null;
//   tempSelectedAccessoryIds: Set<number> = new Set();
//   cartService = inject(CartService);
//   router = inject(Router);

//   ngOnInit(): void {
//     this.loadCart();
//   }
//   loadCart(): void {
//     this.isLoading = true;

//     this.cartService.getCart().subscribe({
//       next: (cartData) => {
//         this.cart = cartData;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Erro ao carregar carrinho', err);
//         this.isLoading = false;
//         Swal.fire('Erro', 'Não foi possível carregar seu carrinho.', 'error');
//       },
//     });
//   }

//   editAccessories(item: CartItem): void {
//     this.editingItem = JSON.parse(JSON.stringify(item)); // Clona o item
//     this.tempSelectedAccessoryIds.clear();
//     this.editingItem?.chosenAccessories.forEach((acc) => {
//       this.tempSelectedAccessoryIds.add(acc.id);
//     });
//     this.modalRef = this.modalService.open(this.modalEditAccessories); // Abre o modal
//   }

//   // Funções que o modal de checkbox precisa
//   toggleAccessorySelection(accessory: Acessory, isChecked: boolean): void {
//     if (isChecked) {
//       this.tempSelectedAccessoryIds.add(accessory.id);
//     } else {
//       this.tempSelectedAccessoryIds.delete(accessory.id);
//     }
//   }

//   isAccessorySelected(accessoryId: number): boolean {
//     return this.tempSelectedAccessoryIds.has(accessoryId);
//   }

//   saveAccessoryChanges(): void {
//     if (!this.editingItem) return;

//     const request: CartItemRequestDTO = {
//       carId: this.editingItem.car.id,
//       accessoryIds: Array.from(this.tempSelectedAccessoryIds),
//     };

//     this.cartService.updateCartItem(this.editingItem.id, request).subscribe({
//       next: (updatedItem) => {
//         Swal.fire('Atualizado!', `Preço atualizado.`, 'success');
//         this.modalRef?.close();
//         this.loadCart();
//       },
//       error: (err) => {
//         Swal.fire('Erro!', 'Não foi possível atualizar o item.', 'error');
//       },
//     });
//   }

//   removeItem(item: CartItem): void {
//     Swal.fire({
//       title: 'Remover Item',
//       text: `Deseja remover ${item.car.name} do carrinho?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sim, remover!',
//       cancelButtonText: 'Cancelar',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.cartService.removeFromCart(item.id).subscribe({
//           next: () => {
//             Swal.fire('Removido!', 'Item removido do carrinho.', 'success');
//             this.loadCart();
//           },
//           error: (err) => {
//             Swal.fire('Erro!', 'Não foi possível remover o item.', 'error');
//           },
//         });
//       }
//     });
//   }

//   goToCheckout(): void {
//     this.modalRef = this.modalService.open(this.modalCheckoutsdetails, {
//       modalClass: 'modal-lg',
//     });
//   }

//   returnCheckout(event: any): void {
//     this.modalRef?.close();
//     this.loadCart(); // Recarrega o carrinho após o checkout
//   }
//   goToHome(): void {
//     this.router.navigate(['/admin/cars']);
//   }

//   closeModal(): void {
//     this.modalRef.close();
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalService, MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { CartService } from '../../../services/cart';
import { CartItem } from '../../../models/cart-item';
import { CartItemRequestDTO } from '../../../models/cart-item-request.dto';
import { Cart } from '../../../models/cart';
import { Acessory } from '../../../models/acessory';
import { Checkoutsdetails } from '../../checkouts/checkoutsdetails/checkoutsdetails';
import { mergeMap, Observable, retryWhen, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-cartslist',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, CommonModule, MdbModalModule, Checkoutsdetails],
  templateUrl: './cartslist.html',
  styleUrls: ['./cartslist.scss'],
})
export class Cartslist implements OnInit {
  isLoading = true;
  cart!: Cart;

  @ViewChild('modalCheckoutsdetails') modalCheckoutsdetails!: TemplateRef<any>;
  @ViewChild('modalEditAccessories') modalEditAccessories!: TemplateRef<any>;

  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;
  editingItem!: CartItem;
  tempSelectedAccessoryIds: Set<number> = new Set();

  cartService = inject(CartService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erro', 'Não foi possível carregar seu carrinho.', 'error');
      },
    });
  }

  editAccessories(item: CartItem): void {
    this.editingItem = JSON.parse(JSON.stringify(item));
    this.tempSelectedAccessoryIds.clear();
    this.editingItem?.chosenAccessories?.forEach((acc) =>
      this.tempSelectedAccessoryIds.add(acc.id)
    );
    this.modalRef = this.modalService.open(this.modalEditAccessories);
  }

  toggleAccessorySelection(accessory: Acessory, isChecked: boolean): void {
    if (isChecked) this.tempSelectedAccessoryIds.add(accessory.id);
    else this.tempSelectedAccessoryIds.delete(accessory.id);
  }

  isAccessorySelected(accessoryId: number): boolean {
    return this.tempSelectedAccessoryIds.has(accessoryId);
  }

  saveAccessoryChanges(): void {
    if (!this.editingItem) return;

    const request: CartItemRequestDTO = {
      carId: this.editingItem.car.id,
      accessoryIds: Array.from(this.tempSelectedAccessoryIds),
    };

    this.cartService.updateCartItem(this.editingItem.id, request).subscribe({
      next: () => {
        Swal.fire('Atualizado!', 'Preço atualizado.', 'success');
        this.modalRef.close();
        this.loadCart();
      },
      error: () => Swal.fire('Erro!', 'Não foi possível atualizar o item.', 'error'),
    });
  }

  // removeItem(item: CartItem): void {
  //   Swal.fire({
  //     title: 'Remover Item',
  //     text: `Deseja remover ${item.car.name} do carrinho?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sim, remover!',
  //     cancelButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.cartService.removeFromCart(item.id).subscribe({
  //         next: () => {
  //           Swal.fire('Removido!', 'Item removido do carrinho.', 'success');
  //           this.loadCart();
  //         },
  //         error: () => Swal.fire('Erro!', 'Não foi possível remover o item.', 'error'),
  //       });
  //     }
  //   });
  // }
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
        this.retryRequest(this.cartService.removeFromCart(item.id)).subscribe({
          next: () => {
            Swal.fire('Removido!', 'Item removido do carrinho.', 'success');
            this.loadCart();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erro!', 'Não foi possível remover o item.', 'error');
          },
        });
      }
    });
  }

  goToCheckout(): void {
    this.modalRef = this.modalService.open(this.modalCheckoutsdetails, {
      modalClass: 'modal-lg',
    });
  }

  returnCheckout(): void {
    this.modalRef.close();
    this.loadCart();
  }

  goToHome(): void {
    this.router.navigate(['/admin/cars']);
  }

  closeModal(): void {
    this.modalRef.close();
  }
  getGrandTotal(): number {
    if (!this.cart || !this.cart.items) {
      return 0;
    }
    return this.cart.items.reduce((total, item) => {
      return total + this.getTotalPrice(item);
    }, 0);
  }

  getTotalPrice(item: CartItem): number {
    const accessoriesTotal = item.chosenAccessories?.reduce((t, a) => t + a.price, 0) || 0;
    return item.car?.price ? item.car.price + accessoriesTotal : accessoriesTotal;
  }

  // clearCart(): void {
  //   if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
  //     Swal.fire('Carrinho vazio', 'Não há itens para limpar.', 'info');
  //     return;
  //   }
  //   Swal.fire({
  //     title: 'Tem certeza?',
  //     text: 'Isso vai remover todos os itens do carrinho!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sim, limpar',
  //     cancelButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.cartService.clearCart().subscribe({
  //         next: () => {
  //           Swal.fire('Limpo!', 'O carrinho foi esvaziado.', 'success');
  //           this.loadCart(); // recarrega a lista de itens
  //         },
  //         error: (err) => {
  //           console.error(err);
  //           Swal.fire('Erro', 'Não foi possível limpar o carrinho.', 'error');
  //         },
  //       });
  //     }
  //   });
  // }

  isClearingCart = false;

  clearCart(): void {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      Swal.fire('Carrinho vazio', 'Não há itens para limpar.', 'info');
      return;
    }

    if (this.isClearingCart) return; // evita múltiplos cliques
    this.isClearingCart = true;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Isso vai remover todos os itens do carrinho!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.retryRequest(this.cartService.clearCart(), 3, 300).subscribe({
          next: () => {
            Swal.fire('Limpo!', 'O carrinho foi esvaziado.', 'success');
            this.loadCart(); // recarrega a lista de itens
            this.isClearingCart = false;
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erro', 'Não foi possível limpar o carrinho.', 'error');
            this.isClearingCart = false;
          },
        });
      } else {
        this.isClearingCart = false;
      }
    });
  }
  private retryRequest<T>(observable$: Observable<T>, retries = 3, delayMs = 200): Observable<T> {
    return observable$.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, i) => {
            if (i < retries && error.status === 400 && error.error?.includes('Deadlock')) {
              return timer(delayMs); // espera e tenta novamente
            }
            return throwError(() => error);
          })
        )
      )
    );
  }
}

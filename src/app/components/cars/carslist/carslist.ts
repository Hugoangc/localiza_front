import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { Car } from '../../../models/car';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Carsdetails } from '../carsdetails/carsdetails';
import { CarService } from '../../../services/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../auth/login.service';
import { CartService } from '../../../services/cart';
import { CartItemRequestDTO } from '../../../models/cart-item-request.dto';

@Component({
  selector: 'app-carslist',
  standalone: true,
  imports: [FormsModule, MdbModalModule, Carsdetails, CommonModule],
  templateUrl: './carslist.html',
  styleUrl: './carslist.scss',
})
export class Carslist {
  list: Car[] = [];
  search: string = '';
  editedCar!: Car;
  loginService = inject(LoginService);

  carService = inject(CarService);
  cartService = inject(CartService);
  //modals
  @ViewChild('modalCarsDetails') modalCarsDetails!: TemplateRef<any>; // referencia da modal
  modalService = inject(MdbModalService); // pra abrir a modal
  modalRef: any; // instancia da modal

  constructor() {
    this.findAll();
  }

  findAll() {
    this.carService.findAll().subscribe({
      next: (list) => {
        this.list = list;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      },
    });
  }

  deleteById(car: Car) {
    Swal.fire({
      title: 'Are you sure you want to delete this car?!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carService.deleteById(car.id).subscribe({
          next: (mensage) => {
            Swal.fire(mensage, '', 'success');
            this.findAll();
          },
          error: (err) => {
            Swal.fire(err.error, '', 'error');
          },
        });
      }
    });
  }
  newCar() {
    this.editedCar = new Car();
    this.editedCar.acessories = [];
    this.modalRef = this.modalService.open(this.modalCarsDetails);
  }
  editCar(car: Car) {
    this.editedCar = Object.assign({}, car); // clone pra evitar alterar o original
    this.modalRef = this.modalService.open(this.modalCarsDetails);
    //this.modalRef.componentInstance.car = car;
  }

  returnDetail(car: Car) {
    this.findAll();
    this.modalRef.close();
  }

  findNames() {
    if (!this.search || this.search.trim() === '') {
      this.findAll();
      return;
    }

    this.carService.findNames(this.search).subscribe({
      next: (list) => {
        this.list = list;
      },
      error: (erro) => {
        console.error('Debug:', erro);

        let errorMessage = 'cant load the list';

        if (erro.status === 0) {
          errorMessage = 'network error.';
        } else if (erro.error && typeof erro.error === 'string') {
          errorMessage = erro.error;
        } else if (erro.error && erro.error.message) {
          errorMessage = erro.error.message;
        }

        Swal.fire('Erro!', errorMessage, 'error');
      },
    });
  }
  addToCart(car: Car) {
    let accessoryHtml = '';
    if (car.acessories && car.acessories.length > 0) {
      accessoryHtml = '<div style="text-align: left; margin-top: 15px;">';
      car.acessories.forEach((acc) => {
        accessoryHtml += `
          <div class="swal2-checkbox" style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type="checkbox"
                   class="swal2-input"
                   value="${acc.id}" 
                   id="acc-${acc.id}">
            <label for="acc-${acc.id}" style="margin-left: 10px; cursor: pointer;">
              ${acc.name} (+ $${acc.price.toFixed(2)})
            </label>
          </div>
        `;
      });
      accessoryHtml += '</div>';
    } else {
      accessoryHtml = '<p>Este carro não possui acessórios adicionais.</p>';
    }

    Swal.fire({
      title: `Personalize seu ${car.name}`,
      html: `
        <p>Preço base: $${car.price.toFixed(2)}</p>
        <p>Selecione os acessórios (o preço será recalculado no carrinho):</p>
        ${accessoryHtml}
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Adicionar ao Carrinho',
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

        this.cartService.addToCart(request).subscribe({
          next: (cartItem) => {
            Swal.fire(
              'Adicionado!',
              `${car.name} foi adicionado ao carrinho por $${cartItem.calculatedPrice.toFixed(2)}`,
              'success'
            );
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erro!', 'Não foi possível adicionar o item ao carrinho.', 'error');
          },
        });
      }
    });
  }
}

import { Component, inject, ViewChild, TemplateRef, Input } from '@angular/core';
import { Car } from '../../../models/car';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Carsdetails } from '../carsdetails/carsdetails';
import { CarService } from '../../../services/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../auth/login.service';
import { CartService } from '../../../services/cart';
import { CartItem } from '../../../models/cart-item';
import { CartItemRequestDTO } from '../../../models/cart-item-request.dto';
import { Cart } from '../../../models/cart';
import { Acessory } from '../../../models/acessory';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { Cartslist } from '../../carts/cartslist/cartslist';
import { Cartsdetails } from '../../carts/cartsdetails/cartsdetails';
import { Router } from '@angular/router';
@Component({
  selector: 'app-carslist',
  standalone: true,
  imports: [
    FormsModule,
    MdbModalModule,
    Carsdetails,
    CommonModule,
    MdbRangeModule,
    MdbFormsModule,
    Cartsdetails,
  ],
  templateUrl: './carslist.html',
  styleUrl: './carslist.scss',
})
export class Carslist {
  list: Car[] = [];
  search: string = '';
  editedCar!: Car;
  loginService = inject(LoginService);
  isLoading = true;
  carService = inject(CarService);
  cartService = inject(CartService);

  tempSelectedAccessoryIds: Set<number> = new Set();

  //modals
  @ViewChild('modalCarsDetails') modalCarsDetails!: TemplateRef<any>; // referencia da modal
  @ViewChild('modalCartsDetails') modalCartsDetails!: TemplateRef<any>;
  router = inject(Router);
  modalService = inject(MdbModalService);
  modalRef: any; // instancia da modal

  @Input() isAddingToCart: boolean = false;
  ngOnInit() {
    if (this.editedCar && this.editedCar.acessories) {
      this.editedCar.acessories.forEach((acc) => this.tempSelectedAccessoryIds.add(acc.id));
    }
  }
  searchBrand: string = '';
  searchMinPrice: number | null = null;
  MAX_PRICE_LIMIT: number = 200000;
  searchMaxPrice: number = 100000;
  constructor() {
    this.findAll();
  }

  toggleAccessory(accessoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.tempSelectedAccessoryIds.add(accessoryId);
    } else {
      this.tempSelectedAccessoryIds.delete(accessoryId);
    }
  }

  saveCarChanges(): void {
    if (this.isAddingToCart) {
      this.addToCart(this.editedCar); // Chama a função de carrinho
    } else {
      this.saveCar();
    }
  }
  saveCar(): void {
    this.carService.save(this.editedCar);
    this.modalRef.emit(this.editedCar);
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

  loadCars(): void {
    this.isLoading = true;
    this.carService.findByPriceBetween(this.searchBrand, undefined, this.searchMaxPrice).subscribe({
      next: (cars) => {
        this.list = cars;
        this.isLoading = false;
      },
      error: (erro) => {
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.loadCars();
  }

  clearFilters(): void {
    this.searchBrand = '';
    this.searchMaxPrice = this.MAX_PRICE_LIMIT;
    this.applyFilters();
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
  addToCart(car: Car): void {
    this.editedCar = car;
    this.modalRef = this.modalService.open(this.modalCartsDetails);
  }
  handleCartReturn(event: 'goToCart' | 'continue') {
    if (event === 'continue') {
      this.modalRef.close();
    }
    if (event === 'goToCart') {
      this.router.navigate(['/admin/cart']);
      this.modalRef.close();
    } else {
    }
  }
  newCar() {
    this.editedCar = new Car();
    this.editedCar.acessories = [];
    this.modalRef = this.modalService.open(this.modalCarsDetails);
  }
  editCar(car: Car) {
    this.editedCar = Object.assign({}, car);
    this.modalRef = this.modalService.open(this.modalCarsDetails);
    //this.modalRef.componentInstance.car = car;
  }

  returnDetail(event: any) {
    this.modalRef.close();

    if (event && event.items) {
      this.modalRef = this.modalService.open(this.modalCartsDetails);
    } else {
      this.findAll();
    }
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
}

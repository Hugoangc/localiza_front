import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { Car } from '../../../models/car';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Carsdetails } from '../carsdetails/carsdetails';
import { CarService } from '../../../services/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  carService = inject(CarService);

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
}

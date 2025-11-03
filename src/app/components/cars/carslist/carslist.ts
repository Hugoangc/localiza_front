import { Component, inject, ViewChild } from '@angular/core';
import { Car } from '../../../models/car';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Carsdetails } from '../carsdetails/carsdetails';
@Component({
  selector: 'app-carslist',
  imports: [RouterLink, MdbModalModule, Carsdetails],
  templateUrl: './carslist.html',
  styleUrl: './carslist.scss',
})
export class Carslist {
  list: Car[] = [];
  editedCar: Car = new Car(0, '', '');

  //modals
  modalService = inject(MdbModalService); // pra abrir a modal
  @ViewChild('modalCarDetail') modalCarDetail: any; // referencia da modal
  modalRef: any; // instancia da modal

  constructor() {
    this.list.push(new Car(1, 'Corolla Hybrid', 'Toyota', 2020));
    this.list.push(new Car(2, 'Civic Advanced Hybrid', 'Honda', 2019));
    this.list.push(new Car(3, 'Mustang Mach-E', 'Ford', 2018));

    let newCar = history.state.newCar;
    let editedCar = history.state.editedCar;

    if (newCar) {
      newCar.id = this.list.length + 1;
      this.list.push(newCar);
    }
    if (editedCar) {
      let i = this.list.findIndex((x) => {
        return x.id == editedCar.id;
      });
      this.list[i] = editedCar;
    }
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
        let i = this.list.findIndex((x) => {
          return x.id == car.id;
        });
        this.list.splice(i, 1);
        Swal.fire({
          title: 'Deleted successfully!',
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        });
      }
    });
  }
  newCar() {
    this.editedCar = new Car(0, '', '');
    this.modalRef = this.modalService.open(this.modalCarDetail);
  }
  editCar(car: Car) {
    this.editedCar = Object.assign({}, car); // clone pra evitar alterar o original
    this.modalRef = this.modalService.open(this.modalCarDetail);
    //this.modalRef.componentInstance.car = car;
  }
  returnDetail(car: Car) {
    if (car.id > 0) {
      let index = this.list.findIndex((x) => {
        return x.id == car.id;
      });
      this.list[index] = car;
    } else {
      car.id = 55;
      this.list.push(car);
    }
    this.modalRef.close();
  }
}

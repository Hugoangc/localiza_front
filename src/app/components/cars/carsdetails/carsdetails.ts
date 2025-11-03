import { Component, inject } from '@angular/core';
import { Car } from '../../../models/car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carsdetails',
  imports: [CommonModule, MdbFormsModule, FormsModule],
  templateUrl: './carsdetails.html',
  styleUrl: './carsdetails.scss',
})
export class Carsdetails {
  car: Car = new Car(0, '', '');
  router = inject(ActivatedRoute); //parametro de rota
  router2 = inject(Router); //direcionamento
  constructor() {
    const id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    let newCar: Car = new Car(id, 'Sample Model', 'Sample Brand', 2022);
    this.car = newCar;
  }
  register() {
    throw new Error('Method not implemented.');
  }
}

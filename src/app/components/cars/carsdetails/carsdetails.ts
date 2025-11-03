import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../../../models/car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-carsdetails',
  imports: [CommonModule, MdbFormsModule, FormsModule],
  templateUrl: './carsdetails.html',
  styleUrl: './carsdetails.scss',
})
export class Carsdetails {
  @Input('car') car: Car = new Car(0, '', '');
  @Output('return') return = new EventEmitter<any>();
  router = inject(ActivatedRoute); //parametro de rota
  router2 = inject(Router); //direcionamento
  constructor() {
    const id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    let newCar: Car = new Car(id, '', '');
    this.car = newCar;
  }
  save() {
    if (this.car.id > 0) {
      Swal.fire({
        title: 'Car edited successfully!',
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      this.router2.navigate(['/admin/cars'], { state: { editedCar: this.car } });
    } else {
      Swal.fire({
        title: 'Car saved successfully!',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.router2.navigate(['/admin/cars'], { state: { newCar: this.car } });
    }
    this.return.emit(this.car);
  }
}

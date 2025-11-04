import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../../../models/car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CarService } from '../../../services/car';
@Component({
  selector: 'app-carsdetails',
  standalone: true,
  imports: [CommonModule, MdbFormsModule, FormsModule],
  templateUrl: './carsdetails.html',
  styleUrl: './carsdetails.scss',
})
export class Carsdetails {
  @Input('car') car: Car = new Car(0, '', '', new Date().getFullYear());
  @Output('return') return = new EventEmitter<any>();
  router = inject(ActivatedRoute); //parametro de rota
  router2 = inject(Router); //direcionamento

  carService = inject(CarService);

  constructor() {
    const id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.carService.findById(id).subscribe({
      next: (returnedCar) => {
        this.car = returnedCar;
      },
      error: (err) => {
        Swal.fire(err.error, '', 'error');
      },
    });
  }

  save() {
    if (this.car.id > 0) {
      this.carService.update(this.car, this.car.id).subscribe({
        next: (mensagem) => {
          Swal.fire('Updated successfully!', '', 'success');
          //this.router2.navigate(['admin/cars'], {state: editedCar: this.car});
          //this.return.emit(this.car);
          this.return.emit('OK');
        },
        error: (err) => {
          Swal.fire({
            title: 'An error occurred while updating!',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    } else {
      this.carService.save(this.car).subscribe({
        next: () => {
          Swal.fire('Saved successfully!', '', 'success');
          //this.router2.navigate(['admin/cars'], {state: newCar: this.car});
          //this.return.emit(this.car);
          this.return.emit('OK');
        },
        error: (err) => {
          Swal.fire({
            title: 'An error occurred while saving!',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    }
  }
}

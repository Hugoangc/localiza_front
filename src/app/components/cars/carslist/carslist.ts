import { Component } from '@angular/core';
import { Car } from '../../../models/car';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carslist',
  imports: [RouterLink],
  templateUrl: './carslist.html',
  styleUrl: './carslist.scss',
})
export class Carslist {
  list: Car[] = [];

  constructor() {
    this.list.push(new Car(1, 'Corolla Hybrid', 'Toyota', 2020));
    this.list.push(new Car(2, 'Civic Advanced Hybrid', 'Honda', 2019));
    this.list.push(new Car(3, 'Mustang Mach-E', 'Ford', 2018));
  }

  deleteById(car: Car) {
    if (confirm('Are you sure you want to delete this car?')) {
      let i = this.list.findIndex((x) => {
        return x.id == car.id;
      });
      this.list.splice(i, 1);
    }
  }
}

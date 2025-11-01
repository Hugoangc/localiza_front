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
  delete() {
    throw new Error('Method not implemented.');
  }
  list: Car[] = [];

  constructor() {
    this.list.push(new Car(1, 'Toyota'));
    this.list.push(new Car(2, 'Honda'));
    this.list.push(new Car(3, 'Ford'));
  }
}

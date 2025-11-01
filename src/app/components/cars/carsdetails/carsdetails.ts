import { Component } from '@angular/core';
import { Car } from '../../../models/car';

@Component({
  selector: 'app-carsdetails',
  imports: [],
  templateUrl: './carsdetails.html',
  styleUrl: './carsdetails.scss',
})
export class Carsdetails {
  car: Car = new Car(0, '');
}

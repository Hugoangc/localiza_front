import { Acessory } from './acessory';
import { Brand } from './brand';

export class Car {
  id!: number;
  name!: string;
  color!: string;
  price!: number;
  brand!: Brand;
  manufactureYear!: number;
  carStatus: boolean = true;
  acessories: Acessory[] = [];
  constructor() {}

  // constructor(id: number, name: string, manufactureYear: number, brand: Brand) {
  //   this.id = id;
  //   this.name = name;
  //   this.manufactureYear = manufactureYear;
  //   this.brand = brand;
  // }
}

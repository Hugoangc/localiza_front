export class Car {
  id!: number;
  name!: string;
  brand!: string;
  manufactureYear!: number;

  constructor(
    id: number,
    name: string,
    brand: string,
    manufactureYear: number = new Date().getFullYear()
  ) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.manufactureYear = manufactureYear;
  }
}

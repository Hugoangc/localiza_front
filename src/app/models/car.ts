export class Car {
  id!: number;
  name!: string;
  brand!: string;
  manufacturedYear!: number;

  constructor(
    id: number,
    name: string,
    brand: string,
    manufacturedYear: number = new Date().getFullYear()
  ) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.manufacturedYear = manufacturedYear;
  }
}

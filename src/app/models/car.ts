import { Brand } from './brand';

export class Car {
  id!: number;
  name!: string;
  brand!: Brand;
  manufactureYear!: number;
  carStatus: boolean = true;
}

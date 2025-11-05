import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Car } from '../../../models/car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CarService } from '../../../services/car';
import { Brand } from '../../../models/brand';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Brandslist } from '../../brands/brandslist/brandslist';
import { Acessorieslist } from '../../acessories/acessorieslist/acessorieslist';
import { Acessory } from '../../../models/acessory';
@Component({
  selector: 'app-carsdetails',
  standalone: true,
  imports: [CommonModule, MdbFormsModule, FormsModule, Brandslist, Acessorieslist],
  templateUrl: './carsdetails.html',
  styleUrl: './carsdetails.scss',
})
export class Carsdetails {
  @Input('car') car!: Car;
  @Output('return') return = new EventEmitter<any>();
  router = inject(ActivatedRoute); //parametro de rota
  router2 = inject(Router); //direcionamento

  carService = inject(CarService);

  //modals
  @ViewChild('modalAcessories') modalAcessories!: TemplateRef<any>; // referencia da modal

  @ViewChild('modalBrands') modalBrands!: TemplateRef<any>; // referencia da modal
  modalService = inject(MdbModalService); // pra abrir a modal
  modalRef: any; // instancia da modal
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
    if (!this.car.brand || !this.car.brand.id) {
      Swal.fire('Erro', 'Select a Brand.', 'error');
      return;
    }
    const carPayload: any = {
      ...this.car,
      brand: {
        id: this.car.brand.id,
      },
      acessories: this.car.acessories.map((acessory) => ({ id: acessory.id })),
    };
    if (this.car.id > 0) {
      this.carService.update(carPayload, this.car.id).subscribe({
        next: (mensage) => {
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
      this.carService.save(carPayload).subscribe({
        next: () => {
          Swal.fire('Saved successfully!', '', 'success');
          //this.router2.navigate(['admin/cars'], {state: newCar: this.car});
          //this.return.emit(this.car);
          this.return.emit('OK');
        },
        error: (err) => {
          Swal.fire({
            title: err,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    }
  }
  searchBrand() {
    this.modalRef = this.modalService.open(this.modalBrands, { modalClass: 'modal-lg' });
  }
  brandReturn(brand: Brand) {
    this.car.brand = brand;
    this.modalRef.close();
  }

  searchAcessory() {
    this.modalRef = this.modalService.open(this.modalAcessories, { modalClass: 'modal-lg' });
  }
  acessoryReturn(acessory: Acessory) {
    if (this.car.acessories == null) this.car.acessories = [];

    this.car.acessories.push(acessory);
    this.modalRef.close();
  }
  unlinkAccessory(acessory: Acessory) {
    let index = this.car.acessories.findIndex((x) => {
      return x.id == acessory.id;
    });
    this.car.acessories.splice(index, 1);
  }
}

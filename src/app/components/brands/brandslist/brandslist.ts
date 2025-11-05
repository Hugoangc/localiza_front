import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Brandsdetails } from '../brandsdetails/brandsdetails';
import { BrandService } from '../../../services/brand';
import Swal from 'sweetalert2';
import { Brand } from '../../../models/brand';
import { RouterLink } from '@angular/router';
import { Carsdetails } from '../../cars/carsdetails/carsdetails';
@Component({
  selector: 'app-brandslist',
  standalone: true,
  imports: [FormsModule, MdbModalModule, CommonModule, Brandsdetails],
  templateUrl: './brandslist.html',
  styleUrl: './brandslist.scss',
})
export class Brandslist {
  list: Brand[] = [];
  search: string = '';
  editedBrand!: Brand;

  //modals

  @ViewChild('modalBrands') modalBrands!: TemplateRef<any>; // referencia da modal
  modalService = inject(MdbModalService); // pra abrir a modal
  modalRef: any; // instancia da modal

  @Input('modeModal') modeModal: boolean = false;
  @Input('hiddenButtons') hiddenButtons: boolean = false;

  @Output('return') myEvent = new EventEmitter();

  BrandService = inject(BrandService);
  loginService = inject(BrandService);

  constructor() {
    this.findAll();
  }
  findAll() {
    this.BrandService.findAll().subscribe({
      next: (list) => {
        this.list = list;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      },
    });
  }

  deleteById(brand: Brand) {
    Swal.fire({
      title: 'Are you sure you want to delete this brand?!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.BrandService.deleteById(brand.id).subscribe({
          next: (mensage) => {
            Swal.fire(mensage, '', 'success');
            this.findAll();
          },
          error: (err) => {
            Swal.fire(err.error, '', 'error');
          },
        });
      }
    });
  }
  findByName() {
    this.BrandService.findByName(this.search).subscribe({
      next: (list) => {
        this.list = list;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      },
    });
  }

  newBrand() {
    this.editedBrand = new Brand();
    this.modalRef = this.modalService.open(this.modalBrands);
  }
  returnDetail(event: any) {
    this.findAll();
    this.modalRef.close();
  }
  selectedBrand(brand: Brand) {
    this.myEvent.emit(brand);
  }
  editBrand(brand: Brand) {
    this.editedBrand = Object.assign({}, brand); // clone pra evitar alterar o original
    this.modalRef = this.modalService.open(this.modalBrands);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { Brandsdetails } from '../brandsdetails/brandsdetails';
import { BrandService } from '../../../services/brand';
import Swal from 'sweetalert2';
import { Brand } from '../../../models/brand';

@Component({
  selector: 'app-brandslist',
  imports: [FormsModule, MdbModalModule, Brandsdetails, CommonModule],
  templateUrl: './brandslist.html',
  styleUrl: './brandslist.scss',
})
export class Brandslist {
  list: Brand[] = [];
  search: string = '';

  @Input('modeModal') modeModal: boolean = false;
  @Output('myEvent') myEvent = new EventEmitter();

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
  selectedBrand(brand: Brand) {
    if (this.modeModal) {
      this.myEvent.emit(brand);
    }
  }
}

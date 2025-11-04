import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../../../models/car';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { BrandService } from '../../../services/brand';
import { Brand } from '../../../models/brand';
@Component({
  selector: 'app-brandsdetails',
  imports: [CommonModule, MdbFormsModule, FormsModule],
  templateUrl: './brandsdetails.html',
  styleUrl: './brandsdetails.scss',
})
export class Brandsdetails {
  brand: Brand = new Brand();

  activeRoute = inject(ActivatedRoute); //parametro de rota
  router = inject(Router); //direcionamento
  brandService = inject(BrandService);

  constructor() {
    const id = this.activeRoute.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.brandService.findById(id).subscribe({
      next: (returnedBrand) => {
        this.brand = returnedBrand;
      },
      error: (err) => {
        Swal.fire(err.error, '', 'error');
      },
    });
  }
  save() {
    if (this.brand.id > 0) {
      this.brandService.update(this.brand, this.brand.id).subscribe({
        next: (mensagem) => {
          Swal.fire('Updated successfully!', '', 'success');
          this.router.navigate(['admin/brands']);
        },
        error: (err) => {
          Swal.fire(err.error, '', 'error');
        },
      });
    } else {
      this.brandService.save(this.brand).subscribe({
        next: (mensagem) => {
          Swal.fire('Saved successfully!', '', 'success');
          this.router.navigate(['admin/brands']);
        },
        error: (err) => {
          Swal.fire(err.error, '', 'error');
        },
      });
    }
  }
}

import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
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
  //brand: Brand = new Brand();

  @Input('brand') brand: Brand = new Brand();
  @Output('return') return = new EventEmitter<any>();

  activeRoute = inject(ActivatedRoute); //parametro de rota
  router = inject(Router); //direcionamento
  brandService = inject(BrandService);
  
  constructor() {
    // const idString = this.activeRoute.snapshot.params['id'];
    // if (idString) {
    //   const idNumber = +idString;
    //   if (idNumber > 0) {
    //     this.findById(idNumber);
    //   }
    // }
  }

  findById(id: number) {
    this.brandService.findById(id).subscribe({
      next: (returnedBrand) => {
        this.brand = returnedBrand;
      },
      error: (err) => {
        this.showError(err, 'Error: looking for brand');
      },
    });
  }
  save() {
    if (this.brand.id > 0) {
      this.brandService.update(this.brand, this.brand.id).subscribe({
        next: (mensage) => {
          Swal.fire('Updated successfully!', '', 'success');
          //this.router.navigate(['admin/brands']);
          this.return.emit('OK');
        },
        error: (err) => {
          this.showError(err, 'Error: updating');
        },
      });
    } else {
      this.brandService.save(this.brand).subscribe({
        next: (mensage) => {
          Swal.fire('Saved successfully!', '', 'success');
          //this.router.navigate(['admin/brands']);
          this.return.emit('OK');
        },
        error: (err) => {
          this.showError(err, 'Error: saving');
        },
      });
    }
  }
  showError(err: any, titleCm: string) {
    console.error('COMPLETE ERROR:', err);

    let errorMessage = 'Unknow error.';

    if (err.error) {
      try {
        const errorObj = JSON.parse(err.error);
        if (errorObj.error) {
          errorMessage = errorObj.error;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      } catch (e) {
        if (typeof err.error === 'string') {
          errorMessage = err.error;
        }
      }
    }

    Swal.fire(titleCm, errorMessage, 'error');
  }
}

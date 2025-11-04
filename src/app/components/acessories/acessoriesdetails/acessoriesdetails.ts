import { Component, inject } from '@angular/core';
import { AcessoryService } from '../../../services/acessory';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Acessory } from '../../../models/acessory';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acessoriesdetails',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './acessoriesdetails.html',
  styleUrl: './acessoriesdetails.scss',
})
export class Acessoriesdetails {
  acessory: Acessory = new Acessory();
  activedRote = inject(ActivatedRoute);
  router = inject(Router);
  acessoryService = inject(AcessoryService);

  constructor() {
    let id = this.activedRote.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: string) {
    this.acessoryService.findById(id).subscribe({
      next: (returnedAcessory) => {
        this.acessory = returnedAcessory;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      },
    });
  }
  save() {
    if (this.acessory.id > 0) {
      this.acessoryService.update(this.acessory, this.acessory.id).subscribe({
        next: (mensage) => {
          Swal.fire(mensage, '', 'success');
          this.router.navigate(['admin/acessories']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        },
      });
    } else {
      this.acessoryService.save(this.acessory).subscribe({
        next: (mensage) => {
          Swal.fire(mensage, '', 'success');
          this.router.navigate(['admin/acessories']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        },
      });
    }
  }
}

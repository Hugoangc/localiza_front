import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AcessoryService } from '../../../services/acessory';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Acessory } from '../../../models/acessory';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acessoriesdetails',
  imports: [MdbFormsModule, FormsModule, CommonModule],
  templateUrl: './acessoriesdetails.html',
  styleUrl: './acessoriesdetails.scss',
})
export class Acessoriesdetails {
  @Input('acessory') acessory: Acessory = new Acessory();
  @Output('return') return = new EventEmitter<any>();
  activedRote = inject(ActivatedRoute);
  router = inject(Router);
  acessoryService = inject(AcessoryService);

  // acessory: Acessory = new Acessory();
  // activedRote = inject(ActivatedRoute);
  // router = inject(Router);
  // acessoryService = inject(AcessoryService);

  constructor() {
    // let id = this.activedRote.snapshot.params['id'];
    // if (id) {
    //   this.findById(id);
    // }
  }

  findById(id: string) {
    this.acessoryService.findById(id).subscribe({
      next: (returnedAcessory) => {
        this.acessory = returnedAcessory;
      },
      error: (erro) => {
        console.error('Debug:', erro);

        let errorMessage = 'cant load the list';

        if (erro.status === 0) {
          errorMessage = 'network error.';
        } else if (erro.error && typeof erro.error === 'string') {
          errorMessage = erro.error;
        } else if (erro.error && erro.error.message) {
          errorMessage = erro.error.message;
        }

        Swal.fire('Erro!', errorMessage, 'error');
      },
    });
  }
  save() {
    if (this.acessory.id > 0) {
      this.acessoryService.update(this.acessory, this.acessory.id).subscribe({
        next: (mensage) => {
          Swal.fire(mensage, '', 'success');
          // this.router.navigate(['admin/acessories']);
          this.return.emit('OK');
        },
        error: (erro) => {
          console.error('Debug:', erro);

          let errorMessage = 'cant load the list';

          if (erro.status === 0) {
            errorMessage = 'network error.';
          } else if (erro.error && typeof erro.error === 'string') {
            errorMessage = erro.error;
          } else if (erro.error && erro.error.message) {
            errorMessage = erro.error.message;
          }

          Swal.fire('Erro!', errorMessage, 'error');
        },
      });
    } else {
      this.acessoryService.save(this.acessory).subscribe({
        next: (mensage) => {
          Swal.fire(mensage, '', 'success');
          // this.router.navigate(['admin/acessories']);
          this.return.emit('OK');
        },
        error: (erro) => {
          console.error('Debug:', erro);

          let errorMessage = 'cant load the list';

          if (erro.status === 0) {
            errorMessage = 'network error.';
          } else if (erro.error && typeof erro.error === 'string') {
            errorMessage = erro.error;
          } else if (erro.error && erro.error.message) {
            errorMessage = erro.error.message;
          }

          Swal.fire('Erro!', errorMessage, 'error');
        },
      });
    }
  }
}

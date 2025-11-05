import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AcessoryService } from '../../../services/acessory';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Acessory } from '../../../models/acessory';
import { Page } from '../../../models/page';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Acessoriesdetails } from '../acessoriesdetails/acessoriesdetails';
@Component({
  selector: 'app-acessorieslist',
  standalone: true,
  imports: [FormsModule, MdbModalModule, Acessoriesdetails, CommonModule, NgbPaginationModule],
  templateUrl: './acessorieslist.html',
  styleUrl: './acessorieslist.scss',
})
export class Acessorieslist {
  list: Acessory[] = [];
  page: Page = new Page();
  numPage: number = 1;
  qtdePerPage: number = 100;

  search: string = '';

  editedAcessory!: Acessory;
  @ViewChild('modalAcessoriesDetails') modalAcessoriesDetails!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef: any;

  //@ViewChild('modalAcessoriesDetails') modalAcessoriesDetails!: TemplateRef<any>; // referencia da modal
  @Input('modeModal') modeModal: boolean = false;
  @Input('hiddenButtons') hiddenButtons: boolean = false;
  @Output('return') myEvent = new EventEmitter();

  acessoryService = inject(AcessoryService);
  constructor() {
    this.findAll();
  }

  findAll() {
    this.acessoryService.findAll(this.numPage, this.qtdePerPage).subscribe({
      next: (page) => {
        this.list = page.content;
        this.page = page;
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
  deleteById(acessory: Acessory) {
    Swal.fire({
      title: 'Are you sure you want to delete this acessory',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.acessoryService.deleteById(acessory.id).subscribe({
          next: (mensage) => {
            Swal.fire(mensage, '', 'success');
            this.findAll();
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
    });
  }

  findByName() {
    this.acessoryService.findByName(this.search).subscribe({
      next: (list) => {
        this.list = list;
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

  select(acessory: Acessory) {
    this.myEvent.emit(acessory);
  }

  // changePage(clickedPage: any) {
  //   this.numPage = clickedPage;
  //   this.findAll();
  // }
  newAcessory() {
    this.editedAcessory = new Acessory();
    this.modalRef = this.modalService.open(this.modalAcessoriesDetails);
  }

  editAcessory(acessory: Acessory) {
    this.editedAcessory = Object.assign({}, acessory);
    this.modalRef = this.modalService.open(this.modalAcessoriesDetails);
  }

  returnDetail(event: any) {
    this.findAll();
    this.modalRef.close();
  }
}

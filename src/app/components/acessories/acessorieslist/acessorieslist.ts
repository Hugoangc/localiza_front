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
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
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
  qtdePerPage: number = 5;

  search: string = '';

  //@ViewChild('modalAcessoriesDetails') modalAcessoriesDetails!: TemplateRef<any>; // referencia da modal
  @Input('modeModal') modeModal: boolean = false;
  @Output('myEvent') myEvent = new EventEmitter();

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
        Swal.fire(erro.error, '', 'error');
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
            Swal.fire(erro.error, '', 'error');
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
        Swal.fire(erro.error, '', 'error');
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
}

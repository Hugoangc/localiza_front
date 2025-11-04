import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AcessoryService } from '../../../services/acessory';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { Acessory } from '../../../models/acessory';
import { Page } from '../../../models/page';
@Component({
  selector: 'app-acessorieslist',
  imports: [],
  templateUrl: './acessorieslist.html',
  styleUrl: './acessorieslist.scss',
})
export class Acessorieslist {
  list: Acessory[] = [];
  page: Page = new Page();
  numPage: number = 1;
  qtdePerPage: number = 5;

  search: string = '';

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
}

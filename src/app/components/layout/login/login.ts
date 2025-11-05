import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../auth/login.service';
import { Login } from '../../../auth/login';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { RegisterFormComponent } from '../register/register';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule, RegisterFormComponent, MdbModalModule, CommonModule],
  //imports: [MdbFormsModule, FormsModule, RegisterFormComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  login: Login = new Login();
  router = inject(Router);

  loginService = inject(LoginService);
  @ViewChild('modalRegister') modalRegister!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef: any;
  constructor() {
    //this.loginService.removerToken();
  }
  logar() {
    this.loginService.logar(this.login).subscribe({
      next: (token) => {
        if (token) {
          this.loginService.addToken(token);
          this.router.navigate(['/admin/cars']);
        } else {
          Swal.fire('Falha no Login', 'Usuário ou senha incorretos.', 'warning');
        }
      },
      error: (erro) => {
        console.error(erro);
        Swal.fire('Erro', 'Ocorreu um erro ao tentar logar.', 'error');
      },
    });
  }

  openRegisterModal() {
    this.modalRef = this.modalService.open(this.modalRegister);
  }

  returnDetail(event: any) {
    this.modalRef.close();
  }
}

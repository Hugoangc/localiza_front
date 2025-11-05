import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { LoginService } from '../../../auth/login.service';
import { Login } from '../../../auth/login';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, MdbFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterFormComponent {
  @Output('return') return = new EventEmitter<any>();

  loginData: Login = new Login();
  confirmPassword!: string;

  loginService = inject(LoginService);

  onSubmit() {
    if (this.loginData.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Erro',
        text: 'As senhas não conferem!',
        icon: 'error',
        allowOutsideClick: false,
      });
      return;
    }
    this.loginService.register(this.loginData).subscribe({
      next: (registeredUser) => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Usuário cadastrado! Por favor, faça o login.',
          icon: 'success',
        });
        this.return.emit('OK');
      },
      error: (err) => {
        const errorMessage = err.error || 'Não foi possível cadastrar';
        Swal.fire({ title: 'Erro', text: errorMessage, icon: 'error', allowOutsideClick: false });
      },
    });
  }
}

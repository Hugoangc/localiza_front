import { Component, inject } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { LoginService } from '../../../auth/login.service';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  imports: [MdbCollapseModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  loginService = inject(LoginService);
  usuario!: Usuario;
  constructor() {
    this.usuario = this.loginService.getUsuarioLogado();
  }
  logout() {
    this.loginService.logout();
  }

  toggleMyRole() {
    const currentUser = this.loginService.getUsuarioLogado();

    const newRole = currentUser.role === 'ADMIN' ? 'USER' : 'ADMIN';

    this.loginService.updateUserRole(currentUser.id, newRole).subscribe({
      next: (updatedUser) => {
        Swal.fire(
          'Sucesso!',
          `Sua role foi alterada para ${updatedUser.role}. Você será deslogado.`,
          'success'
        );

        this.loginService.logout();
      },
      error: (err) => {
        Swal.fire('Erro!', 'Acesso negado ou usuário não encontrado.', 'error');
      },
    });
  }
}

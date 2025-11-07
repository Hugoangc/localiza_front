import { Component, inject } from '@angular/core';
import { LoginService } from '../../../auth/login.service';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { DropdownModule, CollapseModule, ButtonModule } from '@coreui/angular';
import { Cart } from '../../../models/cart';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MdbCollapseModule, CommonModule, MdbDropdownModule, DropdownModule],
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

  toggleRole() {
    const currentRole = this.usuario.role;
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    // if (currentRole !== 'ADMIN') {
    //   Swal.fire('Acesso negado', 'Apenas ADMIN pode alternar a role.', 'warning');
    //   return;
    // }

    Swal.fire({
      title: `Mudar para ${newRole}?`,
      text: 'Isso forçará um logout para gerar um novo token.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, mudar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.updateUserRole(this.usuario.id, newRole).subscribe({
          next: (updatedUser) => {
            Swal.fire('Sucesso!', `Role alterada para ${updatedUser.role}.`, 'success');
            this.logout();
          },
          error: (err) => {
            Swal.fire(
              'Erro!',
              'Não foi possível alterar a role. O backend pode estar com erro.',
              'error'
            );
          },
        });
      }
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../auth/login.service';
import { Usuario } from '../../../auth/usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { CartService } from '../../../services/cart';
import { importProvidersFrom } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MdbDropdownModule, MdbCollapseModule, MdbTooltipModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
})
export class Menu implements OnInit {
  loginService = inject(LoginService);
  cartService = inject(CartService);
  usuario!: Usuario;
  cartCount = 0;

  constructor() {
    this.usuario = this.loginService.getUsuarioLogado();
  }

  ngOnInit(): void {
    this.atualizarCarrinho();
    this.cartService.cartUpdated$.subscribe(() => this.atualizarCarrinho());
  }

  atualizarCarrinho() {
    this.cartService.getCart().subscribe({
      next: (cart) => (this.cartCount = cart?.items?.length || 0),
      error: () => (this.cartCount = 0),
    });
  }

  logout() {
    this.loginService.logout();
  }

  toggleRole() {
    const currentRole = this.usuario.role;
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

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
          error: () => {
            Swal.fire('Erro!', 'Não foi possível alterar a role.', 'error');
          },
        });
      }
    });
  }
}

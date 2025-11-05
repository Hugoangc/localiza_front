import { Component, inject } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { LoginService } from '../../../auth/login.service';
import { Usuario } from '../../../auth/usuario';

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
}

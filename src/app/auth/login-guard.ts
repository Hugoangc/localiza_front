import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const loginGuard: CanActivateFn = (route, state) => {
  let loginService = inject(LoginService);
  let router = inject(Router);

  try {
    if (loginService.hasRole('ADMIN')) {
      return true;
    }

    if (loginService.hasRole('USER') && state.url === '/admin/brands') {
      Swal.fire('Acesso Negado', 'Você não tem permissão para acessar esta página.', 'warning');
      router.navigate(['/admin/cars']);
      return false;
    }

    return true;
  } catch (e) {
    console.error('JWT Error caught in guard:', e);

    // Notifica e força o logout
    Swal.fire({
      title: 'Sessão Inválida',
      text: 'Erro de segurança ou token expirado. Faça login novamente.',
      icon: 'error',
    }).then(() => {
      localStorage.removeItem('token');
      router.navigate(['/login']);
    });

    return false;
  }
};

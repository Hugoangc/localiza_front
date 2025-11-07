import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const loginGuard: CanActivateFn = (route, state) => {
  let loginService = inject(LoginService);
  let router = inject(Router);

  try {
    if (!loginService.isLoggedIn()) {
      Swal.fire('Session Expired', 'Please log in again.', 'info');
      router.navigate(['/login']);
      return false;
    }
    if (loginService.hasRole('ADMIN')) {
      return true;
    }

    if (loginService.hasRole('USER') && state.url === '/admin/brands') {
      Swal.fire('Access Denied', 'You do not have permission to access this page.', 'warning');
      router.navigate(['/admin/cars']);
      return false;
    }
    if (loginService.hasRole('USER') && state.url === '/admin/acessories') {
      Swal.fire('Authentication Error', 'Invalid or expired token. Please log in again.', 'error');
      router.navigate(['/admin/cars']);
      return false;
    }

    return true;
  } catch (e) {
    console.error('JWT Error caught in guard:', e);

    // Notifica e força o logout
    Swal.fire({
      title: 'Invalid Session',
      text: 'Security error or expired token. Please log in again.',
      icon: 'error',
    }).then(() => {
      localStorage.removeItem('token');
      router.navigate(['/login']);
    });

    return false;
  }
};

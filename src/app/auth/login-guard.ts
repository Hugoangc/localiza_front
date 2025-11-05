import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  let loginService = inject(LoginService);
  let router = inject(Router);

  if (loginService.hasRole('USER') && state.url == '/admin/brands') {
    alert("You don't have permissions");
    router.navigate(['/admin/cars']);

    return false;
  }

  return true;
};

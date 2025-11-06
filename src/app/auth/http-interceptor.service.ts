import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  let router = inject(Router);

  //inclui o token no localstorageem cada requisição http (header)
  let token = localStorage.getItem('token');
  if (token && !router.url.includes('/login')) {
    request = request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }

  //tratamento de responses, tratar error genericamente aqui
  return next(request).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          Swal.fire({
            title: 'Sessão Expirada',
            text: 'Suas permissões expiraram ou o acesso foi negado. Faça login novamente.',
            icon: 'warning',
          }).then(() => {
            localStorage.removeItem('token');
            router.navigate(['/login']);
          });

          return new Observable<never>((observer) => observer.error(err));
        } else if (err.status >= 400) {
          console.error('API Response Error:', err.status, err.url);
          console.error('Response Body:', err.error);
          return throwError(() => err);
        }
      } else if (err.status === 0) {
        console.error('Network/CORS Error:', err);
        Swal.fire(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor. Verifique o backend ou o CORS.',
          'error'
        );
      } else {
        console.error('An unknown error occurred:', err);
      }
      return throwError(() => err);
    })
  );
};

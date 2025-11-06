import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Login } from './login';
import { Usuario } from './usuario';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  API = 'http://localhost:8080/api/login';
  AUTH_API = 'http://localhost:8080/api/auth';
  router = inject(Router);

  constructor() {}

  logar(login: Login): Observable<string> {
    return this.http.post<string>(this.API, login, { responseType: 'text' as 'json' });
  }

  register(login: Login): Observable<Usuario> {
    return this.http.post<Usuario>('http://localhost:8080/api/auth/register', login);
  }

  addToken(token: string) {
    localStorage.setItem('token', token);
  }
  logout() {
    this.removerToken();
    this.router.navigate(['/login']);
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  jwtDecode() {
    let token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return '';
  }

  hasRole(role: string) {
    let user = this.jwtDecode() as Usuario;
    if (user.role == role) return true;
    else return false;
  }

  getUsuarioLogado() {
    return this.jwtDecode() as Usuario;
  }

  updateUserRole(userId: number, newRole: string): Observable<Usuario> {
    let params = new HttpParams().set('role', newRole);
    return this.http.put<Usuario>(`${this.AUTH_API}/role/${userId}`, {}, { params: params });
  }
}

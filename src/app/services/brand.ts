import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
@Injectable({
  providedIn: 'root',
})
export class BrandService {
  http = inject(HttpClient);
  API = 'http://localhost:8080/api/brand';

  constructor() {}
  findAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.API + '/findAll');
  }
  findByName(nome: string): Observable<Brand[]> {
    let par = new HttpParams().set('nome', nome);

    return this.http.get<Brand[]>(this.API + '/findByName', { params: par });
  }

  findById(id: number): Observable<Brand> {
    return this.http.get<Brand>(this.API + '/' + id);
  }

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(brand: Brand): Observable<string> {
    return this.http.post<string>(this.API + '/save', brand, { responseType: 'text' as 'json' });
  }

  update(brand: Brand, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/' + id, brand, {
      responseType: 'text' as 'json',
    });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Acessory } from '../models/acessory';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class AcessoryService {
  http = inject(HttpClient);
  API = 'http://localhost:8080/api/acessory';
  constructor() {}

  findAll(numPage: number, qtdePerPage: number): Observable<Page> {
    return this.http.get<Page>(this.API + '/findAll/' + numPage + '/' + qtdePerPage);
  }
  findByName(name: string): Observable<Acessory[]> {
    let pair = new HttpParams().set('name', name);
    return this.http.get<Acessory[]>(this.API + '/findByName', { params: pair });
  }
  findById(id: string): Observable<Acessory> {
    return this.http.get<Acessory>(this.API + '/findById/' + id);
  }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/deleteById/' + id, {
      responseType: 'text' as 'json',
    });
  }
  save(acessory: Acessory): Observable<string> {
    return this.http.post<string>(this.API + '/save', acessory, {
      responseType: 'text' as 'json',
    });
  }
  update(acessory: Acessory, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/update/' + id, acessory, {
      responseType: 'text' as 'json',
    });
  }
}

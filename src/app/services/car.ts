import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  http = inject(HttpClient);
  API = 'http://localhost:8080/api/car';

  constructor() {}
  findAll(): Observable<Car[]> {
    return this.http.get<Car[]>(this.API + '/findAll');
  }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/' + id, {
      responseType: 'text' as 'json',
    });
  }
  save(car: Car): Observable<string> {
    return this.http.post<string>(this.API + '/save', car, {
      responseType: 'text' as 'json',
    });
  }
  update(car: Car, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/' + id, car, {
      responseType: 'text' as 'json',
    });
  }
  findById(id: number): Observable<Car> {
    return this.http.get<Car>(this.API + '/' + id);
  }

  findNames(name: string): Observable<Car[]> {
    let params = new HttpParams().set('name', name);
    return this.http.get<Car[]>(this.API + '/findNames', { params: params });
  }
}

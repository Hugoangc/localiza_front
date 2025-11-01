import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { Principal } from './components/layout/principal/principal';
import { Carslist } from './components/cars/carslist/carslist';
import { Carsdetails } from './components/cars/carsdetails/carsdetails';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'admin',
    component: Principal,
    children: [
      { path: 'cars', component: Carslist },
      { path: 'cars/new', component: Carsdetails },
      { path: 'cars/edit/:id', component: Carsdetails },
    ],
  },
];

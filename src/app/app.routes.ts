import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login';
import { Principal } from './components/layout/principal/principal';
import { Carslist } from './components/cars/carslist/carslist';
import { Carsdetails } from './components/cars/carsdetails/carsdetails';
import { Brandslist } from './components/brands/brandslist/brandslist';
import { Brandsdetails } from './components/brands/brandsdetails/brandsdetails';
import { Acessorieslist } from './components/acessories/acessorieslist/acessorieslist';
import { Acessoriesdetails } from './components/acessories/acessoriesdetails/acessoriesdetails';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: Principal,
    children: [
      { path: 'cars', component: Carslist },
      { path: 'cars/new', component: Carsdetails },
      { path: 'cars/edit/:id', component: Carsdetails },
      { path: 'brands', component: Brandslist },
      { path: 'brands/new', component: Brandsdetails },
      { path: 'brands/edit/:id', component: Brandsdetails },
      { path: 'acessories', component: Acessorieslist },
      { path: 'acessories/new', component: Acessoriesdetails },
      { path: 'acessories/edit/:id', component: Acessoriesdetails },
    ],
  },
];

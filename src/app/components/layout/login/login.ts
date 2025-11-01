import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  user!: string;
  password!: string;

  router = inject(Router);
  login() {
    if (this.user === 'admin' && this.password === 'admin') {
      this.router.navigate(['/admin/cars']);
    } else {
      alert('Invalid credentials');
    }
  }
}

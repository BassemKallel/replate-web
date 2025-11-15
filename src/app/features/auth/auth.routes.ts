import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { $locationShim } from '@angular/common/upgrade';
import { publicGuard } from '../../core/guards/publicGuard';
export const AUTH_ROUTES: Routes = [
  { 
    path: 'login', 
    component: Login,
    canActivate: [publicGuard] // <-- 2. Appliquer le guard
  },
  { 
    path: 'register', 
    component: Register,
    canActivate: [publicGuard] // <-- 3. Appliquer le guard
  },
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
];